import { Schema, Types } from "mongoose";
import { Permission } from "./Permission";

export interface IAction {
    _id: string;
    name: string;
    description: string;
    serviceID: Types.ObjectId;
    permissions: [Permission]; // TO DEFINE
    endpoint: string;
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
    serviceID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    permissions: {
        type: [Permission.schema],
        required: true
    },
    endpoint: {
        type: String,
        required: true
    }
});

export default class Action {
    /*

    private static actionModel = model<IAction>("Action", actionSchema);

    static async insert(actionName: string, description: string, parentServiceID: string, inserterUserID: string, availablePermissions: [Permission], endpoint: string) {
        //TODO: HOW DO WE DEFINE PERMISSIONS????
        const newAction = new Action.actionModel({
            description: description,
            name: actionName,
            serviceID: new ObjectId(parentServiceID),
            permissions: availablePermissions,
            endpoint: endpoint
        });

        // Is the parent Service owned by this user?
        const isInserterOwner = await Service.findServiceCreatedByUser(inserterUserID, parentServiceID);
        if (!isInserterOwner) {
            logger.error("Attempting to create an action for a service that the creator user does not own");
            return false;
        }

        // Do we already have an action with the same identifier in the database?
        const res = await Action.actionModel.exists({ name: actionName });
        if (res == null) {
            //Proceed with the save operation
            try {
                await newAction.save();
                return true;
            } catch (e) {
                logger.error("Error while creating action: ", e);
                return false;
            }
        } else {
            logger.error("Attempting to insert a duplicate action");
            return false;
        }
    }

    static async findAllChildrenOfService(parentID: string): Promise<IAction[] | null> {
        try {
            return Action.actionModel.find({ serviceID: new ObjectId(parentID) });
        } catch (e) {
            logger.error("Error while retrieving action: ", e);
            return null;
        }
    }

    static async delete(actionID: string, serviceID: string, ownerID: string) {
        // Is the parent Service owned by this user?
        const isInserterOwner = await Service.findServiceCreatedByUser(ownerID, serviceID);
        if (!isInserterOwner) {
            logger.error("Attempting to delete an action for a service that the creator user does not own");
            return false;
        }

        try {
            await Action.actionModel.deleteOne({ serviceID: new ObjectId(serviceID), _id: new ObjectId(actionID) });
            return true;
        } catch (e) {
            logger.error("Error while deleting action: ", e);
            return false;
        }
    }

     */
}