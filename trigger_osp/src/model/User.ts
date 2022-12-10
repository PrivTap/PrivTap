import { Schema } from "mongoose";

export interface IUser {
    _id: string;
    username: string;
    password: string;
    email: string;
    registrationDate: Date;
    isActive: boolean;
    activationToken: string;
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
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        },
        minLength: 3,
        maxLength: 255,
        match: /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
    },
    registrationDate: {
        type: Date,
        default: () => new Date()
    },
    isActive: {
        type: Boolean,
        default: false
    },
    activationToken: {
        type: String,
        required: true
    }
});

class User {

}

export default new User();





