import { Schema } from "mongoose";
import Model from "../Model";

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
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    activationToken: {
        type: String,
        required: true
    }
});

class User extends Model<IUser> {

    constructor() {
        super("user", userSchema);
    }

    /**
     * Finds a user by username.
     * @param username the username to search for
     */
    async findByUsername(username: string): Promise<IUser|null> {
        return await this.find({ username });
    }

    /**
     * Activates the user account that has the corresponding activation token.
     * @param token the activation token to use to activate the account
     */
    async activateAccount(token: string) {
        return await this.findAndUpdate({ activationToken: token },
            { activationToken: "", isActive: true });
    }
}

export default new User();





