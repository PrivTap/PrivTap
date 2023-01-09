import { Schema, Types } from "mongoose";
import Service from "./Service";
import Model from "../Model";
import Permission, { IPermission } from "./Permission";
import mongoose from "mongoose";
import { findAllOperationAddingAuthorizedTag } from "../helper/misc";
import logger from "../helper/logger";


export interface IAction {
    _id: string;
    name: string;
    description: string;
    serviceId: string;
    endpoint: string;
    inputs: string;
    authorized?: boolean;
    permissions?: string[]| Partial<IPermission>[];
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
    async findAllForService(serviceId: string, associated = false): Promise<Partial<IAction>[] | null> {
        let actions: IAction[] | null;
        if (associated)
            //we don't populate the permissions, permissions is now an array of idPermission (string)
            actions = await this.findAll({ serviceId }, "-serviceId");
        else
            //we populate the permissions, permissions is now an Array of IPermission
            actions = await this.findAll({ serviceId }, "-serviceId", "permissions", "name description");
        if (actions == null)
            return null;
        const actionsResult = new Array<Partial<IAction>>();
        for (const action of actions) {
            if (action.permissions != undefined) {
                let allPermAndAssociated;
                if (associated)
                    allPermAndAssociated = await Permission.getAllPermissionAndAddBooleanTag(serviceId, action.permissions as Types.Array<string>);

                const actionResult: Partial<IAction> = {
                    name: action.name,
                    _id: action._id,
                    endpoint: action.endpoint,
                    description: action.description,
                    permissions: associated ? (allPermAndAssociated ? allPermAndAssociated : []) : action.permissions as Types.Array<Partial<IPermission>>,
                    inputs: action.inputs
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
    /**
     * Returns all the triggers of the following serviceId.The response object includes name, description,populated permission and authorized.
     * A trigger is authorized if the grantedPermission of the user contains the permission of the trigger.
     * @param userId the id of the user
     * @param serviceId the id of the service
     */
    async findAllActionAddingAuthorizedTag(userId: string, serviceId: string): Promise<Partial<IAction>[] | null> {
        try {
            return await findAllOperationAddingAuthorizedTag(this.model, userId, serviceId) as Partial<IAction>[];
        } catch (e) {
            logger.debug(e);
            return null;
        }
    }
}

export default new Action();

