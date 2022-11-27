import mongoose, { Schema } from "mongoose";
import Model from "../Model";
import logger from "../helper/logger";

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
        return rule.userId ==userId;
    }

    /**
     * Return the url for notification of the trigger service for the rule
     *
     */
    async getTriggerNotificationCenter(ruleId: string): Promise<string | null> {
        interface TriggerNotificationCenter {
            triggerUrl: string;
        }

        try {
            const result = await this.model.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(ruleId) } },
                {
                    //left outer join with collection trigger -> it will create a field trigger (as) with an
                    //array containing all the document that match the join
                    $lookup: {
                        from: "trigger",
                        localField: "triggerId",
                        foreignField: "_id",
                        as: "trigger"
                    }
                },//left outer join with collection service
                {
                    $lookup: {
                        from: "service",
                        localField: "trigger.serviceId",
                        foreignField: "_id",
                        as: "service"
                    }
                },
                //remove all the field except the trigger Notification center
                { $project: { _id: 0, "service.triggerNotificationCenter": 1 } }
                //this way should return an array of documents and in each document there should be only the
                //triggerNotificationCenter
            ]) as TriggerNotificationCenter[];
            if (result.length > 1) {
                logger.debug("Should only have one element here");
            }
            return result[0].triggerUrl;
        } catch (e) {
            logger.debug("Error while doing the query for trigger url" + e);
            return null;
        }
    }
}

export default new Rule();