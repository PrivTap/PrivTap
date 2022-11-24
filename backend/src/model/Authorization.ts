import { model, Schema, Types } from "mongoose";
import logger from "../helper/logger";
import ModelHelper from "../helper/model";

export interface IAuthorization {
    _id: string;
    userId: Types.ObjectId;
    serviceId: Types.ObjectId;
    oAuthToken: string;
    grantedPermissions?: Types.Array<Types.ObjectId>;
}

const authorizationSchema= new Schema<IAuthorization>({
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

export default class Authorization {

    private static authorizationModel = model<IAuthorization>("Authorization", authorizationSchema);

    /**
     * Inserts a new authorization into the DB.
     * @param userId the id of the user that grants the authorization
     * @param serviceId the id of the service that the users grants the authorization to
     * @param oAuthToken the OAuth2 token that was created for this authorization
     * @param grantedPermissions the ids of the permissions granted by this authorization
     */
    static async insert(userId: string, serviceId: string, oAuthToken: string, grantedPermissions?: string[]) {
        const newAuthorizationDoc = new Authorization.authorizationModel({
            userId,
            serviceId,
            oAuthToken,
            grantedPermissions
        });

        try {
            await newAuthorizationDoc.save();
            return true;
        } catch (e) {
            ModelHelper.handleMongooseSavingErrors(e, "This authorization already exists");
        }
        return false;
    }

    /**
     * Updates an existing authorization.
     * @param authorizationId the id of the authorization to update
     * @param newValues an object containing the new OAuth2 token and/or the new permission ids
     */
    static async update(authorizationId: string, newValues: { oAuthToken?: string, grantedPermissions?: string[] }) {
        try {
            const res = await Authorization.authorizationModel.updateOne({ _id: authorizationId }, {
                oAuthToken: newValues.oAuthToken,
                grantedPermissions: newValues.grantedPermissions
            });
            return res.modifiedCount == 1;
        } catch (e) {
            ModelHelper.handleMongooseSavingErrors(e);
        }
        return false;
    }

    /**
     * Finds the authorizations given by a user.
     * @param userId the id of the user
     */
    static async findAllForUser(userId: string): Promise<IAuthorization | null> {
        try {
            return await Authorization.authorizationModel.findOne({ userId });
        } catch (e) {
            logger.error("Unexpected error while getting user authorizations: ", e);
        }
        return null;
    }

}