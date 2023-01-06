import { Schema, Types } from "mongoose";
import Model from "../Model";

export interface IPermission {
    _id: string;
    name: string;
    description: string
    serviceId: string
    authorization_details: object
}

const permissionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    serviceId: {
        type: Types.ObjectId,
        required: true
    },
    authorization_details: {
        type: Object,
        required: true
    }
});

export class Permission extends Model<IPermission> {

    constructor() {
        super("permission", permissionSchema);
    }

    /**
     * Checks if a OSP is the creator of a permission.
     * @param userId The OSP Id
     * @param permissionId The service Id
     */
    async isCreator(userId: string, permissionId: string): Promise<boolean> {
        const filteredPermissions = await this.model.aggregate()
            // Keep only the _id and serviceId
            .project({ serviceId: 1 })
            // Filter by _id (permissionId)
            .match({ _id: new Types.ObjectId(permissionId) })
            // Left outer join with services
            .lookup({ from: "services", localField: "serviceId", foreignField: "_id", as: "matchedServices" })
            // Deconstruct array created by the join
            .unwind("matchedServices")
            // Set the userId field taking data from the matchedService data
            .addFields({ "userId": "$matchedServices.creator" })
            // Keep only the _id (permissionId) and the userId
            .project({ userId: 1 });
        // The query is supposed to return an array with just one component if the user is the actual owner of the permission
        return filteredPermissions.length == 1;
    }

    async findByServiceId(serviceId: string, select?: string): Promise<IPermission[] | null> {
        return await this.findAll({ serviceId }, select);
    }

    async belongsToService(permissionId: string, serviceId: string): Promise<boolean> {
        return await this.find({ _id: permissionId, serviceId }) != null;
    }

    /**
     * Return all the permissions , adding to all of them a boolean field: associated. It checks if the id of the permission is into the array of permissionsId (parameters).
     * If it is then the field associated is true, otherwise it is false.
     * @param serviceId The service id
     * @param permissions   The array of permissions id
     */
    async getAllPermissionAndAddBooleanTag(serviceId: string, permissions?: Array<string>): Promise<Partial<IPermission>[] | null> {
        const allPermissions = await this.findByServiceId(serviceId);
        if (allPermissions == null)
            return null;
        return allPermissions.map((permission) => {
            return {
                _id: permission._id,
                name: permission.name,
                description: permission.description,
                associated: permissions == undefined ? false :permissions.includes(permission._id)
            };
        });
    }

    async getAggregateAuthorizationDetails(permissionIds: string[]): Promise<object[]> {
        const aggregate: object[] = [];
        for (let i=0; i<permissionIds.length; i++){
            const permission = await this.model.findById(permissionIds[i]) as IPermission;
            if (permission){
                aggregate.push(permission.authorization_details);
            }
        }
        return aggregate;
    }


    /*async findAllPermission(serviceId: string, userId: string) {
        const result = await this.model.aggregate()
            .match({serviceId: new Types.ObjectId(serviceId)})
            .lookup({
                from: "permissions",
                pipeline: [
                    {
                        $match: {
                            name: "new perm"
                            // userId: new Types.ObjectId(userId),
                            // service: new Types.ObjectId(serviceId)
                        }
                    }],
                /*{$project: {_id: 0, "grantedPermission": 1}},
                {$unwind: {path: "$grantedPermission"}},
                {$lookup: {
                        from: "permissions",
                        localField: "grantedPermission",
                        foreignField: "_id",
                        as: "authPermissions"
                    }
                },
                {$unwind: {path: "$authPermissions"}},
                {$addFields: {
                        _id: "$authPermissions._id",
                        name: "$authPermissions.name",
                        description: "$authPermissions.description",
                        authorized: true
                    }
                },
                {$project: {_id: 1, "name": 1, "description": 1, "authorized": 1}
                }],
                as: "permissions",
                localField: "name",
                foreignField: "name"
            }).unwind({path: "$permissions"})
        console.log(result)
    }*/
}

export default new Permission();

export class PermissionAuthorized {
    _id: string;
    name: string;
    description: string;
    authorized?: boolean;

    constructor(_id: string, name: string, description: string, authorized?: boolean) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.authorized = authorized;
    }
}