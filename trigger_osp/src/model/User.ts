import {model as mongooseModel, Schema} from "mongoose";

export interface IUser {
    _id: string;
    username: string;
    email: string;
}

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
});

class User {
    model = mongooseModel<IUser>("user", userSchema);
}

export default new User();





