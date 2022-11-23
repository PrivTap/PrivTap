import { model, Schema, Types } from "mongoose";
import ModelError from "./ModelError";
import logger from "../helper/logger";

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
authorizationSchema.index({ userId: 1, serviceId: 1 }, { unique: true });

export default class Authorization {

    private static authorizationModel = model<IAuthorization>("Authorization", authorizationSchema);

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
            if (e instanceof Error) {
                if (e.name == "ValidationError") {
                    throw new ModelError("Invalid parameters");
                } else if (e.name == "MongoServerError") {
                    throw new ModelError("This authorization already exists");
                }
            }
            logger.error("Unexpected error while inserting new authorization: ", e);
        }
        return false;
    }

    static async update(authorizationId: string, newValues: { oAuthToken?: string, grantedPermissions?: string[] }) {
        try {
            const res = await Authorization.authorizationModel.updateOne({ _id: authorizationId }, {
                oAuthToken: newValues.oAuthToken,
                grantedPermissions: newValues.grantedPermissions?.map(el => new Types.ObjectId(el))
            });
            return res.modifiedCount == 1;
        } catch (e) {
            if (e instanceof Error) {
                if (e.name == "ValidationError") {
                    throw new ModelError("Invalid parameters");
                }
            }
            logger.error("Unexpected error while updating authorization: ", e);
        }
        return false;
    }

    static async getUserAuthorizations(userId: string): Promise<IAuthorization | null> {
        try {
            return await Authorization.authorizationModel.findOne({ userId });
        } catch (e) {
            logger.error("Unexpected error while getting user authorizations: ", e);
        }
        return null;
    }

}