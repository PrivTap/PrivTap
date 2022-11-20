import { model, ObjectId, Schema, Types } from "mongoose";

export interface IAction {
    _id: string;
    name: string;
    description: string;
    serviceID: ObjectId;
    permissions: [any]; // TO DEFINE
    endpoint: string;
}

const actionSchema = new Schema<IAction>({
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
    serviceID: {
        type: Types.ObjectId,
        required: true
    },
    permissions: {
        type: [Object],
        required: true
    },
    endpoint: {
        type: String,
        required: true
    }
}
);

export default class Action {

    private static actionModel = model<IAction>("Action", actionSchema);

}