import mongoose, { Schema } from "mongoose";
import Model from "../Model";
import logger from "../helper/logger";
import { triggerServiceNotificationServer } from "./Trigger";

export interface IRule {
    _id: string;
    userId: string;
    triggerId: string;
    actionId: string;
    isAuthorized: boolean;
}

const ruleSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    triggerId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    actionId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    isAuthorized: {
        type: Boolean,
        required: true,
        default: false
    }
});
// Build an unique index on tuple <userId, triggerId, actionId> to prevent duplicates
ruleSchema.index({ userId: 1, triggerId: 1, actionId: 1 }, { unique: true });

class Rule extends Model<IRule> {

    constructor() {
        super("rule", ruleSchema);
    }

    /**
     * Finds all rules created by a user.
     * @param userId the id of the user
     */
    async findAllForUser(userId: string): Promise<IRule[] | null> {
        return await this.findAll({ userId: userId });
    }

    /**
     * Checks if a user is the creator of a rule.
     * @param userId the id of the user
     * @param ruleId the rule of the user
     */
    async isCreator(userId: string, ruleId: string) {
        const rule = await this.findById(ruleId);
        if (rule == null)
            return false;
        return rule.userId == userId;
    }

    /**
     * Find the url for notification of the trigger service of a rule and the id of the service
     *
     */
    async getTriggerServiceNotificationServer(ruleId: string): Promise< Partial<triggerServiceNotificationServer> | null> {
        try {
            const result = await this.model.aggregate()
                .match({ _id: new mongoose.Types.ObjectId(ruleId) })
                //keep only the triggerId
                .project({ _id: 0, "triggerId": 1 })
                //left outer join with collection trigger -> it will create a field trigger (as) with an
                //array containing all the document that match the join
                .lookup({ from: "triggers", localField: "triggerId", foreignField: "_id", as: "trigger" })
                //keep only the serviceId
                .unwind({ path: "$trigger" })
                .addFields({ serviceId: "$trigger.serviceId" })
                .project(({ "trigger": 0 }))
                //left outer join with collection service
                .lookup({ from: "services", localField: "serviceId", foreignField: "_id", as: "service" })
                .unwind({ path: "$service" })
                .addFields({ triggerNotificationServer: "$service.triggerNotificationServer" })
                .addFields({ serviceId: "$service._id" })
                //remove all the field except the trigger Notification center
                .project({ _id: 0, "triggerNotificationServer": 1, "triggerId": 1 }) as Partial<triggerServiceNotificationServer>[];
            //this way should return a list of documents and in each document there should be only the
            //triggerNotificationServer
            console.log(result);
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

export default new Rule();
