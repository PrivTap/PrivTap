import {model as mongooseModel, Schema, Types} from "mongoose";

export interface IAuthorization {
    _id: string;
    userId: string;
    permissionIds: [string];
    oauthToken: string;
}

const authorizationSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
    },
    permissionIds: {
        type: [Types.ObjectId],
        required: true
    }
});


class Authorization {
    model = mongooseModel<IAuthorization>("authorization", authorizationSchema);

}

export default new Authorization();





