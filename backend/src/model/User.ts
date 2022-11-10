import {Schema, model, Document} from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    registrationDate: Date;
    isConfirmed: boolean;
    activationToken: string;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    registrationDate: {
        type: Date,
        required: true
    },
    isConfirmed: {
        type: Boolean,
        required: true
    },
    activationToken: {
        type: String,
        required: true
    }
    //TODO
    //array of all service for relation "manages" ?
    //array of all authorization for relation "authorizes" ?
},
{ collection: "User" }
);

export default model<IUser>("User", userSchema);

