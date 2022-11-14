//define what is scope
import {Schema, model, Document} from "mongoose";

export interface IPermission extends Document {
    scope: string;
}

const permissionSchema = new Schema<IPermission>({
    scope: {
        type: String,
        required: true,
    },

},
{ collection: "Permission" }
);

export default class Permission {

    private static permissionModel = model<IPermission>("Permission", permissionSchema);

}