import { ObjectId } from "mongoose";

export interface IAuthorization {
    _id: string;
    userID: ObjectId;
    serviceID: ObjectId;
    grantedPermissions: [ObjectId];
    oAuthToken: string;
}
