import { Types } from "mongoose";

export interface IAuthorization {
    _id: string;
    userID: Types.ObjectId;
    serviceID: Types.ObjectId;
    grantedPermissions: [Types.ObjectId];
    oAuthToken: string;
}
