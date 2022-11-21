import { FilterQuery, model, Schema, Types } from "mongoose";
import ObjectId = Types.ObjectId;
import logger from "../helper/logger";

export interface IService {
    _id: string;
    description: string;
    name: string;
    creator: ObjectId;
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
},
{ collection: "Service" }
);

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
     * @param creatorID The ID of the user that created this service
     * @param authenticationServer The API endpoint of the server used to authenticate the PrivTAP platform with the Service
     * @param clientId The ID of our platform on the authorization server
     * @param clientSecret The secret of our platform on the authorization server
     * @returns A boolean Promise which contains true if the operation was successful, and false otherwise
     */
    static async insert(name: string, description: string, creatorID: string, authenticationServer?: string, clientId?: string, clientSecret?: string) {
        const newService = new Service.serviceModel({
            description: description,
            name: name,
            creator: new ObjectId(creatorID),
            authServer: authenticationServer,
            clientId: clientId,
            clientSecret: clientSecret
        });
        // Do we already have a service with the same identifier in the database?
        const res = await Service.serviceModel.exists({ name: name });
        if (res == null) {
            //Proceed with the save operation
            try {
                await newService.save();
                return true;
            } catch (e) {
                logger.error("Error while creating service: ", e);
                return false;
            }
        } else {
            logger.error("Attempting to insert a duplicate service");
            return false;
        }
    }

    /**
     * Asynchronously retrieves the list of services that a user has created
     * @param userID The ID of the user that created and owns the services to retrieve
     * @returns A Promise containing either the list of services created by the user, or null if something went wrong
     */
    static async findServicesCreatedByUser(userID: string): Promise<IService[] | null> {
        try {
            return Service.serviceModel.find({ creator: new ObjectId(userID) });
        } catch (e) {
            logger.error("Error while retrieving service: ", e);
            return null;
        }
    }

    /**
     * Asynchronously retrieves a specific service that a user has created
     * @param userID The ID of the user that created and owns the services to retrieve
     * @param serviceID The ID of the service to be retrieved
     * @returns A Promise containing either the retrieved service or null if something went wrong
     */
    static async findServiceCreatedByUser(userID: string, serviceID: string): Promise<IService | null> {
        try {
            const result = await Service.serviceModel.findOne({
                creator: new ObjectId(userID),
                _id: new ObjectId(serviceID)
            });
            return result as (IService | null);
        } catch (e) {
            logger.error("Error while retrieving service: ", e);
            return null;
        }
    }

    /**
     * Asynchronously deletes a service that a user created
     * @param userID The ID of the user that created and owns the services to retrieve
     * @param serviceID The ID of the service to be deleted
     * @returns A boolean Promise which contains true if the operation was successful, and false otherwise
     */
    static async deleteService(userID: string, serviceID: string) {
        try {
            await Service.serviceModel.deleteOne({ creator: new ObjectId(userID), _id: new ObjectId(serviceID) });
            return true;
        } catch (e) {
            logger.error("Error while deleting service: ", e);
            return false;
        }
    }

    /**
     * Updates a service with new and updated data
     * @param serviceID The ID of the service to update
     * @param newName The new service name
     * @param newDescription The new service description
     * @param newAuthServer The new authorization server
     * @param newClientId The new client ID
     * @param newClientSecret The new client secret
     * @returns A boolean Promise which contains true if the operation was successful, and false otherwise
     */
    static async updateService(serviceID: string, newName: string | null, newDescription: string | null, newAuthServer: string | null, newClientId: string | null, newClientSecret: string | null) {
        const filterQuery: FilterQuery<IService> = {
            _id: new ObjectId(serviceID)
        };

        const updateQuery: Record<string, unknown> = {};
        if (newName) {
            updateQuery.name = newName;
        }
        if (newDescription) {
            updateQuery.description = newDescription;
        }
        if (newAuthServer) {
            updateQuery.authServer = newAuthServer;
        }
        if (newClientId) {
            updateQuery.clientId = newClientId;
        }
        if (newClientSecret) {
            updateQuery.clientSecret = newClientSecret;
        }

        try {
            const result = await Service.serviceModel.updateOne(filterQuery, updateQuery);
            return result.modifiedCount == 1;
        } catch (error) {
            logger.error("Error while updating service with ID $(serviceID)", error);
            return false;
        }
    }

    /**
     * This function is used to find all the name and description of all the services present
     * @param itemsPerPage is the number of items you want to show in a page: default 10
     * @param page is the number of the current page: default 0
     */
    static async findServices(itemsPerPage?: number, page?: number): Promise<IService[] | null> {
        const defaultItemsPerPage = 10;
        const defaultPage = 0;
        try {
            itemsPerPage = itemsPerPage === undefined ? defaultItemsPerPage : itemsPerPage;
            page = page === undefined ? defaultPage : page;
            const result = await Service.serviceModel.find().skip(page * itemsPerPage).limit(itemsPerPage).select("name description -_id");
            return result as IService[];
        } catch (e) {
            logger.error("Error while retrieving all the services in the database", e);
            return null;
        }
    }
}