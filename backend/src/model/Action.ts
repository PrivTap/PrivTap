import { model, Schema, Types } from "mongoose";
import Service from "./Service";
import logger from "../helper/logger";
import ModelHelper from "../helper/model";

export interface IAction {
    _id: string;
    name: string;
    description: string;
    serviceId: Types.ObjectId;
    endpoint: string;
    permissions?: Types.Array<Types.ObjectId>;
}

const actionSchema = new Schema<IAction>({
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
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
    permissions: [Schema.Types.ObjectId]
});

export default class Action {

    private static actionModel = model<IAction>("Action", actionSchema);

    /**
     * Inserts a new action into the DB.
     * @param actionName the name of the action
     * @param description the description of the action
     * @param parentServiceId the id of the service for which the action will be created
     * @param endpoint the endpoint that this action will send requests to
     * @param requiredPermissionsIds the ids of permissions required by this action
     */
    static async insert(actionName: string, description: string, parentServiceId: string, endpoint: string, requiredPermissionsIds?: string[]) {
        const newAction = new Action.actionModel({
            description: description,
            name: actionName,
            serviceId: parentServiceId,
            endpoint: endpoint,
            permissions: requiredPermissionsIds
        });

        try {
            await newAction.save();
            return true;
        } catch (e) {
            ModelHelper.handleMongooseSavingErrors(e, "An action with the same name already exists");
        }
        return false;
    }

    /**
     * Finds all the actions provided by a service.
     * @param serviceId the id of the service
     */
    static async findAllForService(serviceId: string): Promise<IAction[] | null> {
        try {
            return await Action.actionModel.find({ serviceId });
        } catch (e) {
            logger.error("Error while retrieving action: ", e);
        }
        return null;
    }

    /**
     * Deletes an action from the DB.
     * @param actionId the id of the action to delete
     */
    static async delete(actionId: string) {
        try {
            const res = await Action.actionModel.deleteOne({ _id: actionId });
            return res.deletedCount == 1;
        } catch (e) {
            logger.error("Error while deleting action: ", e);
        }
        return false;
    }

    /**
     * Checks if a user is the creator of an action.
     * @param userId the id of the user
     * @param actionId the id of the action
     */
    static async isCreator(userId: string, actionId: string) {
        try {
            const res = await Action.actionModel.findById(actionId);
            if (res != null) {
                return Service.isCreator(userId, res.serviceId.toString());
            }
        } catch (e) {
            logger.error("Error while verifying action ownership: ", e);
        }
        return false;
    }
}