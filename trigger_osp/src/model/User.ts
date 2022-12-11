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
        index: {
            unique: true
        },
        minLength: 3,
        maxLength: 20,
        match: /[a-zA-Z0-9.\-_]*/
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        },
    }
});

class User {
    model = mongooseModel<IUser>("user", userSchema);
}

export default new User();





