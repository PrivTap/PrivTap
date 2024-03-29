import { Schema, Types } from "mongoose";
import Model from "../Model";
import logger from "../helper/logger";
import { IAction } from "./Action";
import { ITrigger } from "./Trigger";
import { IService } from "./Service";
import { PermissionAuthorized } from "./Permission";

export interface IAuthorization {
    _id: string;
    userId: string;
    serviceId: string;
    oAuthToken: string;
    grantedPermissions?: string[];
}

const authorizationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: "service",
        required: true
    },
    oAuthToken: {
        type: String,
        required: true
    },
    grantedPermissions: [Schema.Types.ObjectId]
});

// Build an unique index on tuple <userId, service> to prevent duplicates
authorizationSchema.index({ userId: 1, serviceId: 1 }, { unique: true });

export type ServiceActions = { serviceName: string, serviceId: string, actions: Partial<IAction>[] }
export type ServiceTriggers = { serviceName: string, serviceId: string, triggers: Partial<ITrigger>[] }

class Authorization extends Model<IAuthorization> {
    constructor() {
        super("authorization", authorizationSchema);
    }

    /**
     * Builds an aggregation query that finds all the operations for all services authorized by a user.
     * @param userId the id of the user
     * @param operation the operation type, can be either 'actions' or 'triggers'
     */
    private servicesAuthorizedByWith(userId: string, operation: "actions" | "triggers") {
        // Create dynamically a projection to remove all non-necessary information from operations
        const operationProjection: Record<string, number> = {};
        for (const key of [`${operation}.endpoint`, `${operation}.serviceId`, `${operation}.__v`, `${operation}.permissions`]) {
            operationProjection[key] = 0;
        }

        // Build the aggregation query
        try {
            return this.model.aggregate()
                // Filter only authorizations given by the user
                .match({ userId: new Types.ObjectId(userId) })
                // Keep only the field containing the service id
                .project({ _id: 0, serviceId: 1 })
                // Join with services collection on the local service id field (left outer join)
                .lookup({ from: "services", localField: "serviceId", foreignField: "_id", as: "service" })
                // Deconstruct the array created by the join to have one document for authorized service
                .unwind("service")
                // Set the serviceId and serviceName fields taking data from the service field
                .addFields({ serviceId: "$service._id", serviceName: "$service.name" })
                // Delete the service field, as it is no longer needed
                .project({ serviceId: 0 })
                // Join with the operation (triggers or actions) collection on the serviceId field (left outer join)
                .lookup({ from: operation, localField: "serviceId", foreignField: "serviceId", as: operation })
                // Keep only the necessary fields for each operation
                .project(operationProjection);
        } catch (e) {
            return null;
        }
    }

    /**
     * Returns all the services with at least an authorization from the user
     * @param userId
     */
    async findAllAuthorizedServices(userId: string) {
        try {
            return await this.model.aggregate()
                .match({ userId: new Types.ObjectId(userId) })
                //keep only the serviceId
                .project({ _id: 0, "serviceId": 1 })
                //left outer join with collection service
                .lookup({ from: "services", localField: "serviceId", foreignField: "_id", as: "service" })
                .unwind({ path: "$service" })
                .addFields({ _id: "$service._id", name: "$service.name", description: "$service.description", baseUrl: "$service.baseUrl" })
                //remove all the field except the relevant service data
                .project({
                    "_id": 1,
                    "name": 1,
                    "description": 1,
                    "baseUrl": 1,
                }) as Partial<IService>[];
        } catch (e) {
            return null;
        }
        //return await this.findAll({ userId }, "serviceId", "service", "name description");
    }

    /**
     * Returns all the permission of a service and also the one granted by a user with an extra field
     */
    async findAllPermissionsAddingAuthorizationTag(serviceId: string, userId: string) {
        try {
            const collection = this.model.aggregate()
                .match(({
                    userId: new Types.ObjectId(userId),
                    serviceId: new Types.ObjectId(serviceId)
                }))
                .project({ _id: 0, "grantedPermissions": 1 })
                .unwind({ path: "$grantedPermissions" })
                .lookup({
                    from: "permissions",
                    localField: "grantedPermissions",
                    foreignField: "_id",
                    as: "authPermissions"
                })
                .unwind({ path: "$authPermissions" })
                .addFields({
                    _id: "$authPermissions._id",
                    name: "$authPermissions.name",
                    description: "$authPermissions.description",
                    authorized: true
                }).project({ _id: 1, "name": 1, "description": 1, "authorized": 1 });
            const IDCollection: string[] = [];
            (await collection).forEach((p) => {
                IDCollection.push(p._id);
            });
            return await collection.unionWith({
                coll: "permissions", pipeline: [
                    {
                        $match: {
                            serviceId: new Types.ObjectId(serviceId),
                            _id: { $nin: IDCollection }
                        }
                    },
                    {
                        $addFields: {
                            authorized: false
                        }
                    },
                    {
                        $project: { _id: 1, "name": 1, "description": 1, "authorized": 1 }
                    }
                ]
            }) as Partial<PermissionAuthorized>[];
        } catch (e) {
            return null;
        }
    }

    async getGrantedPermissionsId(userId: string, serviceId: string) {
        let result;
        try {
            const temp = await this.model.aggregate()
                .match({ userId: new Types.ObjectId(userId), serviceId: new Types.ObjectId(serviceId) })
                .project({ _id: 0, "grantedPermissions": 1 }) as Partial<IAuthorization>[];
            result = temp[0].grantedPermissions;
            return result;
        } catch (e) {
            return null;
        }

    }

    /**
     * Finds the authorizations given by a user.
     * @param userId the id of the user
     */
    async findAllForUser(userId: string): Promise<IAuthorization[] | null> {
        return await this.findAll({ userId });
    }

    /**
     * Get the OAuth token for the userId and the ServiceId
     */
    async findToken(userId: string, serviceId: string): Promise<string | null> {
        const res = await this.find({ userId: userId, serviceId: serviceId });
        if (res != null) {
            return res.oAuthToken;
        }
        return null;
    }

    async removePermission(permissionId: string, serviceId: string) {
        try {
            return await this.model.updateMany(
                { serviceId: serviceId },
                { $pull: { grantedPermissions: permissionId } }
            );
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Deletes all authorizations linked to a service
     * @param serviceId The service ID that owns the authorization
     */
    async deleteAll(serviceId: string): Promise<boolean> {
        try {
            const res = await this.model.deleteMany({ serviceId: serviceId });
            return res.deletedCount > 0;
        } catch (e) {
            logger.error(`Unexpected error while deleting ${this.name}\n`, e);
        }
        return false;
    }

}

export default new Authorization();