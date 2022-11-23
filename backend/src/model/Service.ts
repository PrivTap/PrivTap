import { model, Schema, Types } from "mongoose";
import ObjectId = Types.ObjectId;
import logger from "../helper/logger";

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
     * @param creatorID The ID of the user that created this service
     * @param authenticationServer The API endpoint of the server used to authenticate the PrivTAP platform with the Service
     * @param clientId The ID of our platform on the authorization server
     * @param clientSecret The secret of our platform on the authorization server
     * @returns A boolean Promise which contains true if the operation was successful, and false otherwise
     */
    static async insert(name: string, description: string, creatorID: string, authenticationServer: string, clientId: string, clientSecret: string) {
        const newService = new Service.serviceModel({
            description: description,
            name: name,
            creator: new ObjectId(creatorID),
            authServer: authenticationServer,
            clientId: clientId,
            clientSecret: clientSecret
        });
        try {
            await newService.save();
            return true;
        } catch (e) {
            logger.error("Error while creating service: ", e);
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

    static async deleteService (userId: string, serviceId: string): Promise<boolean>{
        try {
            const queryResult = await Service.serviceModel.findById(new ObjectId(serviceId)) as IService;
            return queryResult.creator.toString() == userId;
        } catch (e){
            console.log("Error deleting a service:", e);
            return false;
        }
    }

    /**
     * Updates a service associated to a given user with new and updated data
     * @param userID The ID of the user associated to the service
     * @param serviceID The ID of the service to update
     * @param newName The new service name
     * @param newDescription The new service description
     * @param newAuthServer The new authorization server
     * @param newClientId The new client ID
     * @param newClientSecret The new client secret
     * @returns A boolean Promise which contains true if the operation was successful, and false otherwise
     */
    static async updateService(userID: string, serviceID: string, newName: string|undefined = undefined, newDescription: string|undefined = undefined, newAuthServer: string|undefined = undefined, newClientId: string|undefined = undefined, newClientSecret: string|undefined = undefined): Promise<boolean>{
        serviceSchema.pre("updateOne", { document: false, query: true }, function(next) {
            const updated = this.getUpdate();
            if (updated) {
                updated.entries().filter((key: string, value: never) => value != undefined);
                this.setUpdate(updated);
            }
            next();
        });

        const query = {
            "_id": new ObjectId(serviceID),
            "creator": new ObjectId(userID)
        };

        const update = {
            "name": newName,
            "description": newDescription,
            "authServer": newAuthServer,
            "clientId": newClientId,
            "clientSecret": newClientSecret
        };

        try {
            const queryResult = await Service.serviceModel.updateOne(query, update);
            return queryResult.modifiedCount == 1;
        } catch (e) {
            logger.error("Error updating a service", e);
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