import { Schema, Types } from "mongoose";
import Model from "../Model";
import logger from "../helper/logger";
import { IAction } from "./Action";
import { ITrigger } from "./Trigger";

export interface IAuthorization {
    _id: string;
    userId: string;
    service: string;
    oAuthToken: string;
    grantedPermissions?: string[];
}

const authorizationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    service: {
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

    /**
     * Builds an aggregation query that finds all the operations for all services authorized by a user.
     * @param userId the id of the user
     * @param operation the operation type, can be either 'actions' or 'triggers'
     */
    private serviceAuthorizedByWith(userId: string, operation: "actions" | "triggers") {
        // Create dynamically a projection to remove all non-necessary information from operations
        const operationProjection: Record<string, number> = {};
        for (const key of [`${operation}.endpoint`, `${operation}.serviceId`, `${operation}.__v`, `${operation}.permissions`]) {
            operationProjection[key] = 0;
        }

        // Build the aggregation query
        return this.model.aggregate()
            // Filter only authorizations given by the user
            .match({ userId: new Types.ObjectId(userId) })
            // Keep only the field containing the service id
            .project({ _id: 0, service: 1 })
            // Join with services collection on the local service id field (left outer join)
            .lookup({ from: "services", localField: "service", foreignField: "_id", as: "service" })
            // Deconstruct the array created by the join to have one document for authorized service
            .unwind("service")
            // Set the serviceId and serviceName fields taking data from the service field
            .addFields({ serviceId: "$service._id", serviceName: "$service.name" })
            // Delete the service field, as it is no longer needed
            .project({ service: 0 })
            // Join with the operation (triggers or actions) collection on the serviceId field (left outer join)
            .lookup({ from: operation, localField: "serviceId", foreignField: "serviceId", as: operation })
            // Keep only the necessary fields for each operation
            .project(operationProjection);
    }

    constructor() {
        super("authorization", authorizationSchema);
    }

    /**
     * Finds all the services that have been authorized by a user and all the actions associated.
     * @param userId the id of the user
     */
    async findAllServicesAuthorizedByUserWithActions(userId: string): Promise<ServiceActions[] | null> {
        try {
            return await this.serviceAuthorizedByWith(userId, "actions");
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
            return await this.serviceAuthorizedByWith(userId, "triggers");
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
        return await this.findAll({ userId });
    }

    /**
     * Get the OAuth token for the userId and the ServiceId
     */
    async findToken(userId: string, serviceId: string): Promise<string | null> {
        const res = await this.find({ userId: userId, service: serviceId });
        if (res != null) {
            return res.oAuthToken;
        }
        return null;
    }

}

export default new Authorization();