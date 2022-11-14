import {Schema, model, Document, Error} from "mongoose";

export interface IService extends Document {
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
{collection: "Service"}
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
    static async insert(name: string, description: string, creatorID: string, authenticationServer?: string, clientId?: string, clientSecret?: string,) {
        const newService = new Service.serviceModel({
            description: description,
            name: name,
            creator: creatorID,
            authServer: authenticationServer,
            clientId: clientId,
            clientSecret: clientSecret
        });
        // Do we already have a service with the same identifier in the database?
        const res = await Service.serviceModel.exists({name: name});
        if (res == null) {
            //Proceed with the save operation
            await newService.save();
        } else throw (new Error("attempting to insert a duplicate item"));
    }

    static async findServicesCreatedByUser(userID: string): Promise<IService[]> {
        const result = await Service.serviceModel.find({creator: userID});
        return result.map(doc => doc as IService);
    }

    static async findServiceCreatedByUser(userID: string, serviceID: string): Promise<IService> {
        const result = await Service.serviceModel.findOne({creator: userID, _id: serviceID});
        return result as IService;
    }

    static async deleteService(userID: string, serviceID: string) {
        await Service.serviceModel.deleteOne({creator: userID, _id: serviceID});
    }

    static async addAuthServer(service: IService, authServer: string, clientId: string, clientSecret: string) {
        service.authServer = authServer;
        service.clientId = clientId;
        service.clientSecret = clientSecret;
        await service.save();
    }
}