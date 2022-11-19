import { FilterQuery, model, Schema, Types } from "mongoose";
import ObjectId = Types.ObjectId;
import logger from "../helper/logger";

export interface IService {
    description: string;
    name: string;
    creator: string;
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
        type: String,
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
     * @throws {Error} An error representing what went wrong when attempting to create the Service
     */
    static async insert(name: string, description: string, creatorID: string, authenticationServer?: string, clientId?: string, clientSecret?: string) {
        const newService = new Service.serviceModel({
            description: description,
            name: name,
            creator: creatorID,
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

    static async findServicesCreatedByUser(userID: string): Promise<IService[] | null> {
        try {
            return Service.serviceModel.find({ creator: userID });
        } catch (e) {
            logger.error("Error while retrieving service: ", e);
            return null;
        }
    }

    static async findServiceCreatedByUser(userID: string, serviceID: string): Promise<IService | null> {
        try {
            const result = await Service.serviceModel.findOne({ creator: userID, _id: serviceID });
            return result as (IService | null);
        } catch (e) {
            logger.error("Error while retrieving service: ", e);
            return null;
        }
    }

    static async deleteService(userID: string, serviceID: string) {
        try {
            await Service.serviceModel.deleteOne({ creator: userID, _id: serviceID });
            return true;
        } catch (e) {
            logger.error("Error while deleting service: ", e);
            return false;
        }
    }

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

    /*static async addAuthServer(service: IService, authServer: string, clientId: string, clientSecret: string) {
        service.authServer = authServer;
        service.clientId = clientId;
        service.clientSecret = clientSecret;
        await service.save();

        const filterQuery: FilterQuery<IUser> = {
            activationToken: token
        };
        const updateQuery: UpdateQuery<IUser> = {
            activationToken: "",
            isConfirmed: true
        };

        const result = await User.userModel.updateOne(filterQuery, updateQuery);
    }*/
}