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

    async insert(document: Partial<IAuthorization>): Promise<boolean> {
        const model = new this.model(document);
        try {
            await model.save();
            return true;
        } catch (e) {
            if ((e as Error).name == "MongoServerError") {
                logger.debug("The Authorization already exists");
                return true;
            }
            logger.debug("Error inserting authorization", e);
            return false;
        }
    }

    async update(update: Partial<IAuthorization>, filter: Partial<IAuthorization>, upsert: boolean = false): Promise<IAuthorization | null> {
        try {
            return await this.model.findOneAndUpdate(filter, update, {upsert: upsert, new: true});
        } catch (e) {
            logger.debug("Error updating authorization", e);
            return null;
        }
    }

    async delete(userId: string): Promise<boolean> {
        try {
            this.model.deleteOne({userId});
            return true;
        } catch (e) {
            logger.debug("Error deleting authorization", e);
            return false;
        }
    }

    async findByToken(oauthToken: string): Promise<IAuthorization | null> {
        return this.model.findOne({oauthToken});
    }
}

export default new Authorization();





