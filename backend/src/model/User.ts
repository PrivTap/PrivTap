//Check how to hashify the password
// We can use bcrypt JS library
//https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
import {Schema, model, Document} from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    owner: IUser["_id"];
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
    }
    //TODO
    //array of all service for relation "manages" ?
    //array of all authorization for relation "authorizes" ?
},
{ collection: "User" }
);

export default model<IUser>("User", userSchema);

