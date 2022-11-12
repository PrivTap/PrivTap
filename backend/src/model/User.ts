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
        index: {
            unique: true
        }
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

export default class User {
    public static userModel = model<IUser>("User", userSchema);

    /**
     * Inserts a new user in the database
     * @param username The new user's username to be inserted
     * @param password The new user's password to be inserted
     * @param email The new user's email to be inserted
     * @param token The new user's activation token to be inserted
     */
    static insertNewUser(username: string, password: string, email: string, token: string) {
        const user = new User.userModel({
            username: username,
            password: password,
            email: email,
            registrationDate: Date(),
            isConfirmed: false,
            activationToken: token
        });
        user.save().then(() => console.log("User added"))
            .catch(e => console.log("Error inserting a new user: ", e));
    }

    /**
     * Starts a query looking for the specified attribute (e.g. username) and value (e.g. "John71")
     * @param attribute The queried attribute
     * @param value The queried value associated to the specified attribute. IUser expects string, boolean and Date types depending on the attribute
     * @result Returns a Promise<IUser> which can be null if the query is empty
     */
    static queryUser(attribute: string, value: string | boolean | Date): Promise<IUser> {
        const queryObject: {[index: typeof attribute] : typeof value} = {};
        queryObject[attribute] = value;
        return User.userModel.findOne(queryObject).then(result => {
            return result as IUser;
        });
    }

    /**
     * Modifies the document specified by the parameters queryAttribute (e.g. username) and queryValue (e.g. "John71") accordingly to modifyAttribute (e.g. email) and modifyValue (e.g. "newEmail@gmail.com")
     * @param queryAttribute The queried attribute
     * @param queryValue The queried value associated to the specified attribute. IUser expects string, boolean and Date types depending on the attribute
     * @param modifyAttribute The attribute to modify
     * @param modifyValue The new value associated to the specified attribute. IUser expects string, boolean and Date types depending on the attribute
     * @result Returns a dictionary containing the fields modifiedCount, equal to the number of modified documents and matchedCount, equal to the number of documents matching the query
     */
    static modifyUser(queryAttribute: string, queryValue: string | boolean | Date, modifyAttribute: string, modifyValue: string | boolean | Date): Promise<{[index: string] : number}> {
        const User = model("User", userSchema);
        const queryObject: {[index: typeof queryAttribute] : typeof queryValue} = {};
        queryObject[queryAttribute] = queryValue;
        const modifyObject: {[index: typeof modifyAttribute] : typeof modifyValue} = {};
        modifyObject[modifyAttribute] = modifyValue;
        return User.updateOne(queryObject, modifyObject).then(result => {
            const resultObject: {[index: string] : number} = {};
            resultObject["modifiedCount"] = result.modifiedCount;
            resultObject["matchedCount"] = result.matchedCount;
            return resultObject;
        });
    }

    static async findById(userId: string): Promise<IUser>{
        const query = await User.userModel.findById(userId);
        return query as IUser;
    }
}





