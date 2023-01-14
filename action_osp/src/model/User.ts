import {model as mongooseModel, Schema} from "mongoose";
import logger from "../helper/logger";

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
    },

});

userSchema.index({username: 1, email: 1}, {unique: true});

class User {
    model = mongooseModel<IUser>("user", userSchema);

    async insert(document: IUser, returnObject = false): Promise<boolean | IUser> {
        const model = new this.model(document);
        const user = await this.model.findOne(document);
        if (user != null) {
            // User already existing
            logger.debug("existing...");
            if (returnObject) {
                document._id = user._id;
                return document;
            }
            return true;
        }
        try {
            await model.save();
            if (returnObject) {
                document._id = model._id;
                return document;
            }
            return true;
        } catch (e) {
            logger.debug("error here")
        }
        return false;
    }

    async findById(userId: string): Promise<IUser | null> {
        return this.model.findById(userId);
    }
}

export default new User();





