import { model, Schema, Types } from "mongoose";
import logger from "../helper/logger";
import ModelHelper from "../helper/model";

export interface IService {
    _id: string;
    description: string;
    name: string;
    creator: Types.ObjectId;
    authServer: string;
    clientId: string;
    clientSecret: string;
}

const serviceSchema = new Schema<IService>({
    description: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
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
    }
});

/**
 * The entrypoint class to handle all Database access operations related to services.
 */
export default class Service {

    /**
     * The MongoDB model and schema definition for the Service document
     * @private
     */
    private static serviceModel = model<IService>("Service", serviceSchema);

    /**
     * Asynchronously adds a new service to the database
     * @param name The name of the new service
     * @param description The description of the service
     * @param creatorId The id of the user that created this service
     * @param authenticationServer The API endpoint of the server used to authenticate the PrivTAP platform with the Service
     * @param clientId The id of our platform on the authorization server
     * @param clientSecret The secret of our platform on the authorization server
     * @returns A boolean Promise which contains true if the operation was successful, and false otherwise
     */
    static async insert(name: string, description: string, creatorId: string, authenticationServer?: string, clientId?: string, clientSecret?: string) {
        const newService = new Service.serviceModel({
            description,
            name,
            creator: creatorId,
            authServer: authenticationServer,
            clientId,
            clientSecret
        });
        try {
            await newService.save();
            return true;
        } catch (e) {
            ModelHelper.handleMongooseSavingErrors(e, "A service with the same name already exists");
        }
        return false;
    }

    /**
     * Asynchronously retrieves the list of services that a user has created
     * @param userId The id of the user that created and owns the services to retrieve
     * @returns A Promise containing either the list of services created by the user, or null if something went wrong
     */
    static async findAllForUser(userId: string): Promise<IService[] | null> {
        try {
            return await Service.serviceModel.find({ creator: userId });
        } catch (e) {
            logger.error("Error while retrieving service: ", e);
        }
        return null;
    }

    /**
     * Deletes a service from the DB.
     * @param serviceId the id of the service to delete
     */
    static async deleteService(serviceId: string): Promise<boolean> {
        try {
            const res = await Service.serviceModel.deleteOne({ _id: serviceId });
            return res.deletedCount == 1;
        } catch (e) {
            console.log("Error while deleting a service:", e);
        }
        return false;
    }

    /**
     * Updates a service associated to a given user with new and updated data.
     * @param serviceId the id of the service to update
     * @param newValues an object containing the values to update
     * @returns A boolean Promise which contains true if the operation was successful, and false otherwise
     */
    static async update(serviceId: string, newValues: { name?: string, description?: string, authServer?: string, clientId?: string, clientSecret?: string}): Promise<boolean> {
        try {
            const queryResult = await Service.serviceModel.updateOne({ _id: serviceId }, newValues);
            return queryResult.modifiedCount == 1;
        } catch (e) {
            ModelHelper.handleMongooseSavingErrors(e, "A service with the same name already exists");
        }
        return false;
    }

    /**
     * Finds the service with the id.
     * @param serviceId the id of the service to find
     */
    static async findById(serviceId: string): Promise<IService | null>{
        try{
            return await Service.serviceModel.findById(serviceId);
        } catch (e){
            logger.error("Error querying service:", e);
        }
        return null;
    }

    /**
     * Checks if a user is the creator of a service.
     * @param userId the id of the user
     * @param serviceId the id of the service
     */
    static async isCreator(userId: string, serviceId: string) {
        try {
            const res = await Service.serviceModel.findOne({ _id: serviceId, creator: userId });
            return res != null;
        } catch (e) {
            logger.error("Error while verifying service ownership: ", e);
        }
        return false;
    }
}