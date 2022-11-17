import { Schema, model, Document, FilterQuery, UpdateQuery } from "mongoose";

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
        maxLenth: 255,
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
    //TODO
    //array of all service for relation "manages" ?
    //array of all authorization for relation "authorizes" ?
},
{ collection: "User" }
);

export default class User {
    private static userModel = model<IUser>("User", userSchema);

    /**
     * Inserts a new user in the database
     * @param username The new user's username to be inserted
     * @param password The new user's password to be inserted
     * @param email The new user's email to be inserted
     * @param token The new user's activation token to be inserted
     */
    static async insertNewUser(username: string, password: string, email: string, token: string) {
        const user = new User.userModel({
            username: username,
            password: password,
            email: email,
            registrationDate: Date(),
            isConfirmed: false,
            activationToken: token
        });
        await user.save();
    }

    /**
     * Starts a query looking for the specified attribute (e.g. username) and value (e.g. "John71")
     * @param attribute The queried attribute
     * @param value The queried value associated to the specified attribute. IUser expects string, boolean and Date types depending on the attribute
     * @result Returns a Promise<IUser> which can be null if the query is empty
     */
    static async queryUser(attribute: string, value: string | boolean | Date): Promise<IUser> {
        const queryObject: {[index: typeof attribute] : typeof value} = {};
        queryObject[attribute] = value;
        const queryResult = await User.userModel.findOne(queryObject);
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

        const result = await User.userModel.updateOne(filterQuery, updateQuery);

        return result.modifiedCount == 1;
    }

    /**
     * Finds an existing user given its user ID
     * @param userId The ID of the user to find in the database
     */
    static async findById(userId: string): Promise<IUser>{
        const query = await User.userModel.findById(userId);
        return query as IUser;
    }
}





