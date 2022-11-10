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

export function insertNewUser(username: string, password: string, email: string, token: string) {
    const User = model("User", userSchema);
    const user = new User({
        username: username,
        password: password,
        email: email,
        registrationDate: Date(),
        isConfirmed: false,
        activationToken: token
    });
    try {
        user.save();
        console.log("User added");
    } catch (e) {
        console.log("Error inserting new user");
    }
}

/**
 * Starts a query looking for the specified attribute (e.g. username) and value (e.g. "John71")
 * @param attribute The queried attribute
 * @param value The queried value associated to the specified attribute
 * @result Returns a Promise<IUser> which can be null if the query is empty
 */
export async function queryUser(attribute: string, value: string): Promise<IUser> {
    const User = model("User", userSchema);
    const idk: {[index: string] : string} = {};
    idk[attribute] = value;
    console.log(idk);
    return await User.findOne(idk) as IUser;
}

export default model<IUser>("User", userSchema);

