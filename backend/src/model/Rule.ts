import { model, ObjectId, Schema, Types } from "mongoose";

export interface IRule {
    _id: string;
    userID: ObjectId;
    triggerID: ObjectId;
    actionID: ObjectId;
    isAuthorized: boolean;
}

const ruleSchema = new Schema<IRule>({
    userID: {
        type: Types.ObjectId,
        required: true
    },
    triggerID: {
        type: Types.ObjectId,
        required: true
    },
    actionID: {
        type: Types.ObjectId,
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

    static async findByUserID(userID: string): Promise<[IRule]|null>{
        return null;
    }

    static async insertNewRule(userID: string, triggerID: string, actionID: string): Promise<boolean>{
        // isAuthorized set to false for now
        return false;
    }

    static async deleteRule(userID: string, ruleID: string): Promise<boolean> {
        return false;
    }


}