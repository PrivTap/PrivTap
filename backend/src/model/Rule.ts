import { model, Schema, Types } from "mongoose";
import logger from "../helper/logger";
import ModelHelper from "../helper/model";

export interface IRule {
    _id: string;
    userId: Types.ObjectId;
    triggerId: Types.ObjectId;
    actionId: Types.ObjectId;
    isAuthorized: boolean;
}

const ruleSchema = new Schema<IRule>({
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
        required: true
    }
});
// Build an unique index on tuple <userId, triggerId, actionId> to prevent duplicates
ruleSchema.index({ userId: 1, triggerId: 1, actionId: 1 }, { unique: true });

export default class Rule {

    private static ruleModel = model<IRule>("Rule", ruleSchema);

    /**
     * Finds all rules created by a user.
     * @param userId the id of the user
     */
    static async findAllForUser(userId: string): Promise<IRule[] | null>{
        try {
            return await Rule.ruleModel.find({ userId: userId });
        } catch (e) {
            logger.error("Error finding rules by id", e);
        }
        return null;
    }

    /**
     * Inserts a new rule into the DB.
     * @param userId the id of the user
     * @param triggerId the id of the trigger
     * @param actionId the id of the action
     */
    static async insert(userId: string, triggerId: string, actionId: string): Promise<boolean>{
        const rule = new Rule.ruleModel({
            userId,
            triggerId,
            actionId,
            // Draft
            isAuthorized: false
        });
        try {
            await rule.save();
            return true;
        } catch (e) {
            ModelHelper.handleMongooseSavingErrors(e, "This rule already exists");
        }
        return false;
    }

    /**
     * Deletes a rule from the DB.
     * @param ruleId the id of the rule
     */
    static async deleteRule(ruleId: string): Promise<boolean> {
        try{
            const res = await Rule.ruleModel.deleteOne({ _id: ruleId });
            return res.deletedCount == 1;
        } catch (e) {
            logger.error("Error while deleting a rule:", e);
        }
        return false;
    }

    /**
     * Checks if a user is the creator of a rule.
     * @param userId the id of the user
     * @param ruleId the rule of the user
     */
    static async isCreator(userId: string, ruleId: string) {
        try {
            const res = await Rule.ruleModel.findOne({ _id: ruleId, creator: userId });
            return res != null;
        } catch (e) {
            logger.error("Error while verifying rule ownership: ", e);
        }
        return false;
    }
}