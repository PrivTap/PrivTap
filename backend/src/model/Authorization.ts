import { Schema } from "mongoose";
import Model from "../Model";
import logger from "../helper/logger";
import { IService } from "./Service";

export interface IAuthorization {
    _id: string;
    userId: string;
    service: string | Partial<IService>;
    oAuthToken: string;
    grantedPermissions?: string[];
}

const authorizationSchema= new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: "service",
        required: true
    },
    oAuthToken: {
        type: String,
        required: true
    },
    grantedPermissions: [Schema.Types.ObjectId]
});
// Build an unique index on tuple <userId, service> to prevent duplicates
authorizationSchema.index({ userId: 1, service: 1 }, { unique: true });

class Authorization extends Model<IAuthorization> {

    constructor() {
        super("authorization", authorizationSchema);
    }

    /**
     * Finds all the services that have been authorized by a user.
     * @param userId the id of the user
     */
    async findAllServicesAuthorizedByUser(userId: string): Promise<Partial<IAuthorization>[] | null> {
        try {
            return await this.model.find({ userId }).select("service").populate("service", "name");
        } catch (e) {
            logger.error("Unexpected error while finding services authorized by a user\n", e);
        }
        return null;
    }

    /**
     * Finds the authorizations given by a user.
     * @param userId the id of the user
     */
    async findAllForUser(userId: string): Promise<IAuthorization[] | null> {
        return await this.findAll({ userId });
    }

}

export default new Authorization();