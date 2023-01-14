import { Schema } from "mongoose";
import Model from "../Model";
import Trigger from "./Trigger";
import Action from "./Action";
import logger from "../helper/logger";
import Authorization from "./Authorization";
import Permission from "./Permission";

export interface IService {
    _id: string;
    name: string;
    description: string;
    creator: string;
    baseUrl: string;
    authPath: string;
    tokenPath: string;
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
    baseUrl: {
        type: String,
        required: true,
    },
    authPath: {
        type: String,
    },
    tokenPath: {
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
serviceSchema.pre("deleteOne", async function () {
    try {
        const id = this.getFilter()["_id"];
        const triggers = (await Trigger.findAllForService(id)) ?? [];

        const actions = (await Action.findAllForService(id)) ?? [];
        await Authorization.deleteAll(id);
        await Permission.deleteAll(id);
        for (const trigger of triggers) {
            if (trigger._id) {
                try {
                    await Trigger.delete(trigger._id);
                } catch (error) {
                    logger.log(error);
                }
            }
        }
        for (const action of actions) {
            if (action._id) {
                try {
                    await Action.delete(action._id);
                } catch (error) {
                    logger.log(error);
                }
            }
        }
    } catch (error) {
        logger.log(error);
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
        const service = await this.findById(serviceId, "apiKey");
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