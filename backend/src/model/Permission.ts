//define what is scope
import { Schema, model } from "mongoose";

export interface IPermission {
    scope: string;
}

const permissionSchema = new Schema<IPermission>({
    scope: {
        type: String,
        required: true,
    },

});

export default class Permission {

    private static permissionModel = model<IPermission>("Permission", permissionSchema);

}