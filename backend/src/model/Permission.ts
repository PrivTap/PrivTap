import { model, Schema } from "mongoose";

export interface IPermission {
    readonly scope: string;
    readonly name: string;
}

const permissionSchema = new Schema<IPermission>({
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    scope: {
        type: String,
        required: true,
    },
});

export class Permission {
    private static permissionModel = model<IPermission>("Permission", permissionSchema);

    // TODO: Implement
}