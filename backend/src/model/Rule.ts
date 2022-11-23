import { model, Schema, Types } from "mongoose";
import logger from "../helper/logger";

export interface IRule {
    _id: string;
    userId: Types.ObjectId;
    triggerId: Types.ObjectId;
    actionId: Types.ObjectId;
    isAuthorized: boolean;
}

// TODO: Understand how to make <triggerId, actionId> unique key

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

export default class Rule {

    private static ruleModel = model<IRule>("Rule", ruleSchema);

    static async findByUserId(userId: string): Promise<IRule[]|undefined>{
        try {
            console.log(userId);
            return await Rule.ruleModel.find({ userId: userId });
        } catch (e) {
            logger.error("Error finding rules by id", e);
            return undefined;
        }
    }

    static async insertNewRule(userId: Types.ObjectId, triggerId: Types.ObjectId, actionId: Types.ObjectId): Promise<boolean>{
        const rule = new Rule.ruleModel({
            userId: userId,
            triggerId: triggerId,
            actionId: actionId,
            // Draft
            isAuthorized: false
        });
        try {
            await rule.save();
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async deleteRule(ruleId: string): Promise<boolean> {
        try{
            await Rule.ruleModel.findByIdAndDelete(ruleId);
            return true;
        } catch (e) {
            logger.error("Error deleting a rule:", e);
            return false;
        }
    }


}