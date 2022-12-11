import { Schema, Types } from "mongoose";
import Service from "./Service";
import Model from "../Model";
import { OperationDataType } from "../helper/rule_execution";
import Permission, { IPermission } from "./Permission";
import mongoose from "mongoose";
export interface IAction {
    _id: string;
    name: string;
    description: string;
    serviceId: string;
    endpoint: string;
    inputs: OperationDataType[];
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
        type: [String]
        // required?
    },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'permission' }]
});

class Action extends Model<IAction> {

    constructor() {
        super("action", actionSchema);
    }

    /**
     * Finds all the actions provided by a service by adding all the permissions and adding a tag
     * @param serviceId the id of the service
     */
    async findAllForService(serviceId: string): Promise<Partial<ActionOsp>[] | null> {
        const allPermissions = await Permission.findByServiceId(serviceId, "name");
        if (allPermissions == null)
            return null;
        let actions: IAction[] | null;
        try {
            actions = await this.findAll({ serviceId }, "-serviceId");
        } catch (e) {
            return null;
        }
        if (actions == null)
            return null;
        const actionsResult = new Array<ActionOsp>();
        actions.forEach((action) => {
            const associatedPerm = Object.assign(<Partial<IPermission>>[], action.permissions);
            let temp: Partial<IPermission>[] = allPermissions.map((permission) => {
                return { _id: permission._id, name: permission.name, associated: associatedPerm.includes(permission._id) };
            });
            const actionResult: ActionOsp = {
                name: action.name,
                _id: action._id,
                endpoint: action.endpoint,
                description: action.description,
                permissions: temp
            }
            actionsResult.push(actionResult);
        })
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
}

export default new Action();
export interface ActionOsp {
    _id: string,
    name: string,
    description: string,
    endpoint: string,
    permissions: Partial<IPermission>[]
}