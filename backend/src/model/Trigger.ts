import { Schema, Types } from "mongoose";
import { Permission } from "./Permission";

export interface ITrigger {
    _id: string;
    name: string;
    description: string;
    serviceId: Types.ObjectId;
    permissions: [Permission]; // TO DEFINE
    data: any[]; // TO DEFINE
}

const triggerSchema = new Schema<ITrigger>({
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
    permissions: {
        type: [Permission.schema], //Permissions MUST be defined at Trigger/Action level, NOT saved into a general DB (Mongoose can also store nested objects)
        required: true
    },
    data: {
        type: [Object]
    }
});

export default class Trigger {
    /*

    private static triggerModel = model<ITrigger>("Trigger", triggerSchema);

    static async insert(triggerName: string, description: string, parentServiceId: string, inserterUserId: string, availablePermissions: [Permission]) {
        //TODO: HOW DO WE DEFINE PERMISSIONS????
        const newTrigger = new Trigger.triggerModel({
            description: description,
            name: triggerName,
            serviceId: new ObjectId(parentServiceId),
            permissions: availablePermissions,
            data: []
        });

        // Is the parent Service owned by this user?
        const isInserterOwner = await Service.findServiceCreatedByUser(inserterUserId, parentServiceId);
        if (!isInserterOwner) {
            logger.error("Attempting to create a trigger for a service that the creator user does not own");
            return false;
        }

        // Do we already have a service with the same identifier in the database?
        const res = await Trigger.triggerModel.exists({ name: triggerName });
        if (res == null) {
            //Proceed with the save operation
            try {
                await newTrigger.save();
                return true;
            } catch (e) {
                logger.error("Error while creating trigger: ", e);
                return false;
            }
        } else {
            logger.error("Attempting to insert a duplicate trigger");
            return false;
        }
    }

    static async findAllChildrenOfService(parentId: string): Promise<ITrigger[] | null> {
        try {
            return Trigger.triggerModel.find({ serviceId: new ObjectId(parentId) });
        } catch (e) {
            logger.error("Error while retrieving service: ", e);
            return null;
        }
    }

    static async delete(triggerId: string, serviceId: string, ownerId: string) {
        // Is the parent Service owned by this user?
        const isInserterOwner = await Service.findServiceCreatedByUser(ownerId, serviceId);
        if (!isInserterOwner) {
            logger.error("Attempting to delete a trigger for a service that the creator user does not own");
            return false;
        }

        try {
            await Trigger.triggerModel.deleteOne({ serviceId: new ObjectId(serviceId), _id: new ObjectId(triggerId) });
            return true;
        } catch (e) {
            logger.error("Error while deleting trigger: ", e);
            return false;
        }
    }

     */
}