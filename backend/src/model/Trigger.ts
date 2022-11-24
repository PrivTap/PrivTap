import { model, Schema, Types } from "mongoose";
import logger from "../helper/logger";
import Service from "./Service";
import ModelHelper from "../helper/model";

export interface ITrigger {
    _id: string;
    name: string;
    description: string;
    serviceId: Types.ObjectId;
    permissions?: Types.Array<Types.ObjectId>;
    data?: Types.Array<string>; // TO DEFINE
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
    permissions: [Schema.Types.ObjectId],
    data: [String]
});

export default class Trigger {

    private static triggerModel = model<ITrigger>("Trigger", triggerSchema);

    /**
     * Inserts a new trigger into the DB.
     * @param triggerName the name of the trigger
     * @param description the description of the trigger
     * @param parentServiceId the id of the service for which the trigger will be created
     * @param requiredPermissions the ids of permissions required by this trigger
     */
    static async insert(triggerName: string, description: string, parentServiceId: string, requiredPermissions: string[]) {
        const newTrigger = new Trigger.triggerModel({
            description: description,
            name: triggerName,
            serviceId: parentServiceId,
            permissions: requiredPermissions,
            data: []
        });

        try {
            await newTrigger.save();
            return true;
        } catch (e) {
            ModelHelper.handleMongooseSavingErrors(e, "A trigger with the same name already exists");
        }
        return false;
    }

    /**
     * Finds all the triggers provided by a service.
     * @param serviceId the id of the service
     */
    static async findAllForService(serviceId: string): Promise<ITrigger[] | null> {
        try {
            return Trigger.triggerModel.find({ serviceId });
        } catch (e) {
            logger.error("Error while retrieving service: ", e);
        }
        return null;
    }

    /**
     * Deletes a trigger from the DB.
     * @param triggerId the id of the trigger
     */
    static async delete(triggerId: string) {
        try {
            const res = await Trigger.triggerModel.deleteOne({ _id: triggerId });
            return res.deletedCount == 1;
        } catch (e) {
            logger.error("Error while deleting trigger: ", e);
        }
        return false;
    }

    /**
     * Checks if a user is the creator of a trigger.
     * @param userId the id of the user
     * @param triggerId the id of the trigger
     */
    static async isCreator(userId: string, triggerId: string) {
        try {
            const res = await Trigger.triggerModel.findById(triggerId);
            if (res != null) {
                return Service.isCreator(userId, res.serviceId.toString());
            }
        } catch (e) {
            logger.error("Error while verifying action ownership: ", e);
        }
        return false;
    }
}