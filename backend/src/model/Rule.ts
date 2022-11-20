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

    private static ruleModel = model<IRule>("Ruke", ruleSchema);

}