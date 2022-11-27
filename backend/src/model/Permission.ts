import { Schema, Types } from "mongoose";
import Model from "../Model";

export interface IPermission {
    _id: string;
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
    },
    serviceId: {
        type: Types.ObjectId,
        required: true
    },
    rarObject: {
        type: Object,
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
    async isCreator(userId: string, permissionId: string): Promise<boolean> {
        return false;
    }

    async findByServiceId(serviceId: string): Promise<IPermission[] | null> {
        return [];
    }

    async belongsToService(permissionId: string, serviceId: string): Promise<boolean> {
        return false;
    }
}

export default new Permission();