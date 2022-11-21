import { model, Schema, Types } from "mongoose";

export interface ITrigger {
    _id: string;
    name: string;
    description: string;
    serviceID: Types.ObjectId;
    permissions: any[]; // TO DEFINE
    data: any[]; // TO DEFINE
}

const triggerSchema = new Schema<ITrigger>({
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
        type: Schema.Types.ObjectId,
        required: true
    },
    permissions: {
        type: [Object],
        required: true
    },
    data: {
        type: [Object]
    }
}
);

export default class Trigger {

    private static triggerModel = model<ITrigger>("Trigger", triggerSchema);

}