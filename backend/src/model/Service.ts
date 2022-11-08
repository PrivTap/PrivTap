import mongoose from "mongoose";

const service = new mongoose.Schema({
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

export default mongoose.model("Service", service);