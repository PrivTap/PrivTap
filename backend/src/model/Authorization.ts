import { Schema, Types } from "mongoose";
import Model from "../Model";
import logger from "../helper/logger";
import { IAction } from "./Action";
import { ITrigger } from "./Trigger";
import { IService } from "./Service";
import { permissionAuthorized } from "./Permission";

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
authorizationSchema.index({ userId: 1, service: 1 }, { unique: true });

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
        return this.model.aggregate()
            // Filter only authorizations given by the user
            .match({userId: new Types.ObjectId(userId)})
            // Keep only the field containing the service id
            .project({_id: 0, serviceId: 1})
            // Join with services collection on the local service id field (left outer join)
            .lookup({from: "services", localField: "serviceId", foreignField: "_id", as: "service"})
            // Deconstruct the array created by the join to have one document for authorized service
            .unwind("service")
            // Set the serviceId and serviceName fields taking data from the service field
            .addFields({serviceId: "$service._id", serviceName: "$service.name"})
            // Delete the service field, as it is no longer needed
            .project({serviceId: 0})
            // Join with the operation (triggers or actions) collection on the serviceId field (left outer join)
            .lookup({from: operation, localField: "serviceId", foreignField: "serviceId", as: operation})
            // Keep only the necessary fields for each operation
            .project(operationProjection);
    }

    /**
     * Returns all the services with at least an authorization from the user
     * @param userId
     */
    async findAllAuthorizedServices(userId: string) {
        return await this.model.aggregate()
            .match({userId: new Types.ObjectId(userId)})
            //keep only the serviceId
            .project({_id: 0, "serviceId": 1})
            //left outer join with collection service
            .lookup({from: "services", localField: "serviceId", foreignField: "_id", as: "service"})
            .unwind({path: "$service"})
            .addFields({_id: "$service._id", name: "$service.name", description: "$service.description"})
            //remove all the field except the relevant service data
            .project({
                "_id": 1,
                "name": 1,
                "description": 1
            }) as Partial<IService>[];
        //return await this.findAll({ userId }, "serviceId", "service", "name description");
    }

    /**
     * Returns all the permission of a service and also the one granted by a user with an extra field
     */
    async findAllPermissionsAddingAuthorizationTag(serviceId: string, userId: string) {
        console.log("user", userId, "\nservice", serviceId, "\n");
        const collection = this.model.aggregate()
            .match(({
                userId: new Types.ObjectId(userId),
                serviceId: new Types.ObjectId(serviceId)
            }))
            .project({_id: 0, "grantedPermissions": 1})
            .unwind({path: "$grantedPermissions"})
            .lookup({
                from: "permissions",
                localField: "grantedPermissions",
                foreignField: "_id",
                as: "authPermissions"
            })
            .unwind({path: "$authPermissions"})
            .addFields({
                _id: "$authPermissions._id",
                name: "$authPermissions.name",
                description: "$authPermissions.description",
                authorized: true
            }).project({_id: 1, "name": 1, "description": 1, "authorized": 1});
        console.log(await collection);
        const IDCollection: string[] = [];
        (await collection).forEach((p) => {
            IDCollection.push(p._id);
        });
        console.log(IDCollection);
        return await collection.unionWith({
            coll: "permissions", pipeline: [
                {
                    $match: {
                        serviceId: new Types.ObjectId(serviceId),
                        _id: {$nin: IDCollection}
                    }
                },
                {
                    $addFields: {
                        authorized: false
                    }
                },
                {
                    $project: {_id: 1, "name": 1, "description": 1, "authorized": 1}
                }
            ]
        }) as Partial<permissionAuthorized>[];
    }

    /**
     * Finds all the services that have been authorized by a user and all the actions associated.
     * @param userId the id of the user
     */
    async findAllServicesAuthorizedByUserWithActions(userId: string): Promise<ServiceActions[] | null> {
        try {
            return await this.servicesAuthorizedByWith(userId, "actions");
        } catch (e) {
            logger.error("Unexpected error while finding services authorized by a user with actions\n", e);
        }
        return null;
    }

    /**
     * Finds all the services that have been authorized by a user and all the triggers associated.
     * @param userId the id of the user
     */
    async findAllServicesAuthorizedByUserWithTriggers(userId: string): Promise<ServiceTriggers[] | null> {
        try {
            return await this.servicesAuthorizedByWith(userId, "triggers");
        } catch (e) {
            logger.error("Unexpected error while finding services authorized by a user with triggers\n", e);
        }
        return null;
    }

    /**
     * Finds the authorizations given by a user.
     * @param userId the id of the user
     */
    async findAllForUser(userId: string): Promise<IAuthorization[] | null> {
        return await this.findAll({userId});
    }

    /**
     * Get the OAuth token for the userId and the ServiceId
     */
    async findToken(userId: string, serviceId: string): Promise<string | null> {
        const res = await this.find({userId: userId, serviceId: serviceId});
        if (res != null) {
            return res.oAuthToken;
        }
        return null;
    }

}

export default new Authorization();