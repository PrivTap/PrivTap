import { Schema } from "mongoose";
import Model from "../Model";

export interface IPermission {
    name: string;
    description: string
    serviceId: string
    rarObject: object
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

    /**
     * Checks if a OSP is the creator of a permission.
     * @param userId The OSP Id
     * @param permissionId The service Id
     */
    async isCreator(userId: string, permissionId: string) {

    }
}

export default new Permission();