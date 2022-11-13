import {Schema, model, Document, Error, CallbackError} from "mongoose";

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
     * @param completionHandler The asynchronous callback used to continue the computation after the operation has either succeeded or failed with an error
     * @throws {Error} An error representing what went wrong when attempting to create the Service
     */
    static insert(name: string, description: string, creatorID: string, completionHandler: (error?: Error | CallbackError) => void, authenticationServer?: string, clientId?: string, clientSecret?: string,) {
        const newService = new Service.serviceModel({
            description: description,
            name: name,
            creator: creatorID,
            authServer: authenticationServer,
            clientId: clientId,
            clientSecret: clientSecret
        });
        // Do we already have a service with the same identifier in the database?
        Service.serviceModel.exists({name: name}, (error, res) => {
            if (res == null) {
                //Proceed with the save operation
                newService.save((error) => {
                    if (error == null) {
                        console.log("Service Added!");
                    }
                    completionHandler(error);
                });
            } else if (error == null) {
                completionHandler(new Error("ERROR: Attempting to insert a duplicate item"));
            } else {
                completionHandler(error);
            }
        });
    }

    static findServicesCreatedByUser(userID: string, successHandler: (services: IService[]) => void, errorHandler: (error: any) => void) {
        Service.serviceModel.find({creator: userID}).then((result) => {
            successHandler(result.map(doc => doc as IService));
        }, errorHandler);
    }

    static findServiceCreatedByUser(userID: string, serviceID: string, successHandler: (service: IService) => void, errorHandler: (error: any) => void) {
        Service.serviceModel.findOne({creator: userID, _id: serviceID}).then((result) => {
            successHandler(result as IService);
        }, errorHandler);
    }

    static deleteService(userID: string, serviceID: string, successHandler: () => void, errorHandler: (error: any) => void) {
        Service.serviceModel.deleteOne({creator: userID, _id: serviceID}).then(() => {
            successHandler();
        }, errorHandler);
    }

    static addAuthServer(service: IService, authServer: string, clientId: string, clientSecret: string, successHandler: () => void, errorHandler: (error: any) => void) {
        service.authServer = authServer;
        service.clientId = clientId;
        service.clientSecret = clientSecret;
        service.save().then(() => {
            successHandler();
        }, errorHandler);
    }
}