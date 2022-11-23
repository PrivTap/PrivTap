import { Schema, model, FilterQuery, UpdateQuery } from "mongoose";
import logger from "../helper/logger";
import ModelError from "./ModelError";

export interface IUser {
    _id: string;
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
    isConfirmed: {
        type: Boolean,
        required: true
    },
    activationToken: {
        type: String,
        required: true
    }
});

export default abstract class User {

    private static userModel = model<IUser>("User", userSchema);

    /**
     * Inserts a new user in the database
     * @param username The new user's username to be inserted
     * @param password The new user's password to be inserted
     * @param email The new user's email to be inserted
     * @param token The new user's activation token to be inserted
     */
    static async insertNewUser(username: string, password: string, email: string, token: string): Promise<boolean> {
        const user = new User.userModel({
            username: username,
            password: password,
            email: email,
            registrationDate: Date(),
            isConfirmed: false,
            activationToken: token
        });
        try {
            await user.save();
        } catch (e) {
            if (e instanceof Error) {
                if (e.name == "ValidationError") {
                    throw new ModelError("Invalid parameters");
                } else if (e.name == "MongoServerError") {
                    throw new ModelError("This username or email is already taken");
                }
            }
            logger.error("Error while inserting new user", e);
            return false;
        }
        return true;
    }

    /**
     * Starts a query looking for the specified attribute (e.g. username) and value (e.g. "John71")
     * @param username the username to search for
     * @result Returns a Promise<IUser> which can be null if the query is empty
     */
    static async findByUsername(username: string): Promise<IUser|null> {
        let queryResult: FilterQuery<IUser>|null;
        try {
            queryResult = await User.userModel.findOne({
                username: username
            });
        } catch (e) {
            logger.error("Error while finding user by username", e);
            return null;
        }
        return queryResult as IUser;
    }

    /**
     * Activates the user account that has the corresponding activation token
     * @param token the activation token to use to activate the account
     */
    static async activateAccount(token: string) {
        const filterQuery: FilterQuery<IUser> = {
            activationToken: token
        };
        const updateQuery: UpdateQuery<IUser> = {
            activationToken: "",
            isConfirmed: true
        };

        let result;
        try {
            result = await User.userModel.updateOne(filterQuery, updateQuery);
        } catch (e) {
            logger.error("Error while activating account", e);
            return false;
        }

        return result.modifiedCount == 1;
    }

    /**
     * Finds an existing user given its user ID
     * @param userId The ID of the user to find in the database
     */
    static async findById(userId: string): Promise<IUser|undefined>{
        try {
            return await User.userModel.findById(userId) as IUser;
        } catch (e) {
            logger.error("Error finding user by id", e);
            return undefined;
        }
    }
}





