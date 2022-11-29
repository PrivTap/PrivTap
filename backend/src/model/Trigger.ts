import mongoose, { Schema, Types } from "mongoose";
import Service from "./Service";
import Model from "../Model";
import { OperationDataType } from "../helper/rule_execution";
import logger from "../helper/logger";

export interface ITrigger {
    _id: string;
    name: string;
    description: string;
    serviceId: string;
    outputs: OperationDataType[];
    permissions?: Types.Array<string>;
    resourceServer?: string;
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
    outputs: {
        type: [String]
        // required?
    },
    permissions: [Schema.Types.ObjectId],
    resourceServer: {
        type: String
    },
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
    async findAllForService(serviceId: string): Promise<Partial<ITrigger>[] | null> {
        return await this.findAll({ serviceId }, "-serviceId");
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

    /**
     * Find the url for notification of the trigger service of a rule and the id of the service
     * @param: triggerId is the id of the trigger in the rule
     */
    async getTriggerServiceNotificationServer(triggerId: string): Promise<Partial<triggerServiceNotificationServer> | null> {
        try {
            const result = await this.model.aggregate()
                .match({ _id: new mongoose.Types.ObjectId(triggerId) })
                //keep only the serviceId
                .project({ _id: 0, "serviceId": 1 })
                //left outer join with collection service
                .lookup({ from: "services", localField: "serviceId", foreignField: "_id", as: "service" })
                .unwind({ path: "$service" })
                .addFields({ triggerNotificationServer: "$service.triggerNotificationServer" })
                //remove all the field except the trigger Notification center
                .project({
                    _id: 0,
                    "triggerNotificationServer": 1,
                    "serviceId": 1
                }) as Partial<triggerServiceNotificationServer>[];
            //this way should return a list of documents and in each document there should be only the
            //triggerNotificationServer
            if (result.length > 1) {
                logger.debug("Should only have one element here");
            }
            return result[0];
        } catch
        (e) {
            logger.debug("Unexpected error while finding the trigger notification url after creating a rule" + e);
            return null;
        }
    }
}

export default new Trigger();

export interface triggerServiceNotificationServer {
    serviceId: string,
    triggerNotificationServer: string,
    triggerId: string
}