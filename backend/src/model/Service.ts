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
    triggerNotificationServer: string;
    apiKey: string;
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
    },
    apiKey: {
        type: String,
        required: true
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
     * Checks if an API key is valid for a service.
     * @param serviceId the id of the service
     * @param apiKey the api key to check
     */
    async isValidAPIKey(serviceId: string, apiKey: string): Promise<boolean> {
        const service = await this.findById(serviceId, "-_id apiKey");
        // TODO: do we need a timing safe compare here?
        return service?.apiKey == apiKey;
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