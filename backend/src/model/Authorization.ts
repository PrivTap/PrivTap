import { Schema, Types } from "mongoose";
import Model from "../Model";
import logger from "../helper/logger";
import { IService } from "./Service";
import { IAction } from "./Action";
import { ITrigger } from "./Trigger";

export interface IAuthorization {
    _id: string;
    userId: string;
    service: string | Partial<IService>;
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

    private serviceAuthorizedByWith = (userId: string, operation: "actions" | "triggers") => {
        const operationProjection: Record<string, number> = {};
        for (const key of [`${operation}.endpoint`, `${operation}.serviceId`, `${operation}.__v`, `${operation}.permissions`]) {
            operationProjection[key] = 0;
        }

        return this.model.aggregate()
            .match({ userId: new Types.ObjectId(userId) })
            .project({ _id: 0, service: 1 })
            .lookup({ from: "services", localField: "service", foreignField: "_id", as: "service" })
            .unwind("service")
            .addFields({ serviceId: "$service._id", serviceName: "$service.name" })
            .project({ service: 0 })
            .lookup({ from: operation, localField: "serviceId", foreignField: "serviceId", as: operation })
            .project(operationProjection);
    };

    constructor() {
        super("authorization", authorizationSchema);
    }

    /**
     * Finds all the services that have been authorized by a user and all the actions associated.
     * @param userId the id of the user
     */
    async findAllServicesAuthorizedByUserWithActions(userId: string): Promise<ServiceActions[] | null> {
        try {
            // return await this.model.find({ userId }).select("service").populate("service", "name");
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

}

export default new Authorization();