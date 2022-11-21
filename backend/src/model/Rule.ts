import { model, Schema, Types } from "mongoose";
import logger from "../helper/logger";

export interface IRule {
    _id: string;
    userID: Types.ObjectId;
    triggerID: Types.ObjectId;
    actionID: Types.ObjectId;
    isAuthorized: boolean;
}

// TODO: Understand how to make <triggerID, actionID> unique key

const ruleSchema = new Schema<IRule>({
    userID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    triggerID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    actionID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    isAuthorized: {
        type: Boolean,
        required: true
    }
}
);

export default class Rule {

    private static ruleModel = model<IRule>("Rule", ruleSchema);

    static async findByUserID(userID: string): Promise<IRule[]|undefined>{
        try {
            console.log(userID);
            return await Rule.ruleModel.find({ userID: userID });
        } catch (e) {
            logger.error("Error finding rules by id", e);
            return undefined;
        }
    }


    static async insertNewRule(userID: Types.ObjectId, triggerID: Types.ObjectId, actionID: Types.ObjectId): Promise<boolean>{
        const rule = new Rule.ruleModel({
            userID: userID,
            triggerID: triggerID,
            actionID: actionID,
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

    static async deleteRule(ruleID: string): Promise<boolean> {
        try{
            await Rule.ruleModel.findByIdAndDelete(ruleID);
            return true;
        } catch (e) {
            logger.error("Error deleting a rule:", e);
            return false;
        }
    }


}