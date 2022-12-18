import {model as mongooseModel, Schema, Types} from "mongoose";
import logger from "../helper/logger";

export interface IAuthorization {
    _id: string;
    userId: string;
    permissionIds: string[];
    code: string;
    oauthToken: string;
}

const authorizationSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        unique: true
    },
    permissionIds: {
        type: [Types.ObjectId],
    },
    code: {
        type: String
    },
    oauthToken: {
        type: String
    }
});


class Authorization {
    model = mongooseModel<IAuthorization>("authorization", authorizationSchema);

    async insert(document: Partial<IAuthorization>): Promise<boolean>{
        const model = new this.model(document);
        try {
            await model.save();
            return true;
        } catch (e) {
            if ((e as Error).name == "MongoServerError"){
                logger.debug("The Authorization already exists");
                return true;
            }
            console.log("Error inserting authorization", e);
            return false;
        }
    }

    async update(update: Partial<IAuthorization>, filter: Partial<IAuthorization>): Promise<boolean>{
        try{
            this.model.findOneAndUpdate(filter, update);
            return true;
        } catch (e) {
            console.log("Error updating authorization", e);
            return false;
        }
    }

    async delete(userId: string): Promise<boolean>{
        try{
            this.model.deleteOne({userId});
            return true;
        } catch (e) {
            console.log("Error deleting authorization", e);
            return false;
        }
    }

    async findByToken(oauthToken: string): Promise<IAuthorization | null>{
        return this.model.findOne({ oauthToken });
    }
}

export default new Authorization();





