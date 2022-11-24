import { Schema } from "mongoose";
import Model from "../Model";

export interface IPermission {
    name: string;
    description: string
}

const permissionSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    description: {
        type: String,
        required: true
    }
});

export class Permission extends Model<IPermission> {

    constructor() {
        super("permission", permissionSchema);
    }

    // TODO: Implement
}

export default new Permission();