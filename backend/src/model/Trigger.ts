import { Schema, Types } from "mongoose";
import Service from "./Service";
import Model from "../Model";

export interface ITrigger {
    _id: string;
    name: string;
    description: string;
    serviceId: string;
    permissions?: Types.Array<string>;
    data?: Types.Array<string>; // TO DEFINE
}

const triggerSchema = new Schema({
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

class Trigger extends Model<ITrigger> {

    constructor() {
        super("trigger", triggerSchema);
    }

    /**
     * Finds all the triggers provided by a service.
     * @param serviceId the id of the service
     */
    async findAllForService(serviceId: string): Promise<ITrigger[] | null> {
        return await this.findAll({ serviceId });
    }

    /**
     * Checks if a user is the creator of a trigger.
     * @param userId the id of the user
     * @param triggerId the id of the trigger
     */
    async isCreator(userId: string, triggerId: string) {
        const trigger = await this.findById(triggerId);
        if (trigger == null)
            return false;
        return Service.isCreator(userId, trigger.serviceId);
    }
}

export default new Trigger();