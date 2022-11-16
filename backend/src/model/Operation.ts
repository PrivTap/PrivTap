import { Schema, model, Document } from "mongoose";

export interface IOperation extends Document {
    description: string;
    name: string;
    service: string;
    permission: [string];
}

const operationSchema = new Schema<IOperation>({
    description: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    //this is the object id of the service -> check if it's the best way to translate a one too many relation
    service: {
        type: String
    },
    permission: {
        type: [String]
    }

},
{ collection: "Operation" }
);

export default class Operation {

    private static operationModel = model<IOperation>("Operation", operationSchema);

}