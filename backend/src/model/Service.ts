import {Schema, model, Document} from "mongoose";

export interface IService extends Document {
    description: string;
    name: string;
    authServer: string;
    clientId: string;
    secret: string;
}

const serviceSchema = new Schema<IService>({
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
    authServer: {
        type: String,
    },
    clientId: {
        type: String
    },
    secret: {
        type: String
    }
},
{ collection: "Service" }
);

export default model<IService>("Service", serviceSchema);