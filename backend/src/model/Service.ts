import { Schema } from "mongoose";
import Model from "../Model";

export interface IService {
    _id: string;
    name: string;
    description: string;
    creator: string;
    authServer: string;
    clientId: string;
    clientSecret: string;
    triggerNotificationServer: string
}

const serviceSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    description: {
        type: String,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    authServer: {
        type: String,
    },
    clientId: {
        type: String
    },
    clientSecret: {
        type: String
    },
    triggerNotificationServer: {
        type: String,
    }
});

/**
 * Class that handles all database access operations related to services.
 */
class Service extends Model<IService> {

    constructor() {
        super("service", serviceSchema);
    }

    /**
     * Finds all services that a user has created.
     * @param userId the id of the user
     */
    async findAllCreatedByUser(userId: string): Promise<IService[] | null> {
        return await this.findAll({ creator: userId });
    }

    /**
     * Checks if a user is the creator of a service.
     * @param userId the id of the user
     * @param serviceId the id of the service
     */
    async isCreator(userId: string, serviceId: string): Promise<boolean> {
        const queryResult = await this.find({ _id: serviceId, creator: userId });
        return queryResult != null;
    }
}

export default new Service();