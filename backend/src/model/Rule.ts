import { Schema } from "mongoose";
import Model from "../Model";

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
    async findAllForUser(userId: string): Promise<IRule[] | null>{
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
}

export default new Rule();