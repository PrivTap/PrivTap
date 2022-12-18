import { Schema, Types } from "mongoose";
import Service from "./Service";
import Model from "../Model";
import Permission, { IPermission } from "./Permission";
import mongoose from "mongoose";
import Authorization from "./Authorization";
import { DataDefinition } from "../helper/dataDefinition";

export interface IAction {
    _id: string;
    name: string;
    description: string;
    serviceId: string;
    endpoint: string;
    inputs: DataDefinition;
    permissions?: Types.Array<string>;
}

const actionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    endpoint: {
        type: String,
        required: true
    },
    inputs: {
        type: String
        // required?
    },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "permission" }]
});

class Action extends Model<IAction> {

    constructor() {
        super("action", actionSchema);
    }

    /**
     * Finds all the Actions provided by a service
     * @param serviceId the id of the service
     * @param associated Default false. If true, it returns the actions containing all the permissions of the service with a boolean field associated. "associated" is true if the permission is already associated to the action.
     */
    async findAllForService(serviceId: string, associated = false): Promise<ActionOsp[] | null> {
        let actions: IAction[] | null;
        if(associated)
            //we don't populate the permissions, permissions is now an array of idPermission (string)
            actions = await this.findAll({ serviceId }, "-serviceId");
        else
            //we populate the permissions, permissions is now an Array of IPermission
            actions = await this.findAll({ serviceId }, "-serviceId", "permissions", "name description");
        if (actions == null)
            return null;
        const actionsResult = new Array<ActionOsp>();
        for (const action of actions) {
            if (action.permissions != undefined) {
                let allPermAndAssociated;
                if (associated)
                    allPermAndAssociated = await Permission.getAllPermissionAndAddBooleanTag(serviceId, action.permissions as Types.Array<string>);

                const actionResult: ActionOsp = {
                    name: action.name,
                    _id: action._id,
                    endpoint: action.endpoint,
                    description: action.description,
                    permissions: associated? (allPermAndAssociated ? allPermAndAssociated : []): action.permissions as Types.Array<Partial<IPermission>>
                };
                actionsResult.push(actionResult);
            }
        }
        return actionsResult;
    }

    /**
     * Checks if a user is the creator of an action.
     * @param userId the id of the user
     * @param actionId the id of the action
     */
    async isCreator(userId: string, actionId: string): Promise<boolean> {
        const action = await this.findById(actionId);
        if (action == null)
            return false;
        return await Service.isCreator(userId, action.serviceId);
    }
    async findAllActionAuthorizedByUser(userId: string, serviceId: string): Promise<ActionOsp[] | null> {
        const grantedPermissionId = await Authorization.getGrantedPermissionsId(userId, serviceId);
        console.log(grantedPermissionId);
        let result;
        try {
            result = await this.model.aggregate()
                .match({ serviceId: new mongoose.Types.ObjectId(serviceId) })
                .match({
                    $expr: {
                        $setIsSubset: ["$permissions", grantedPermissionId]
                    }
                })
                .project({ "outputs": 0, "data": 0, "serviceId":0 }) as ActionOsp[];
        } catch (e) {
            console.log(e);
            return null;
        }
        return result;
    }
}

export default new Action();

export interface ActionOsp {
    _id: string,
    name: string,
    description: string,
    endpoint: string,
    permissions: Partial<IPermission>[]
}