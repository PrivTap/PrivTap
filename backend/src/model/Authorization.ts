import { Schema } from "mongoose";
import Model from "../Model";

export interface IAuthorization {
    _id: string;
    userId: string;
    serviceId: string;
    oAuthToken: string;
    grantedPermissions?: string[];
}

const authorizationSchema= new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    oAuthToken: {
        type: String,
        required: true
    },
    grantedPermissions: [Schema.Types.ObjectId]
});
// Build an unique index on tuple <userId, serviceId> to prevent duplicates
authorizationSchema.index({ userId: 1, serviceId: 1 }, { unique: true });

class Authorization extends Model<IAuthorization> {

    constructor() {
        super("authorization", authorizationSchema);
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