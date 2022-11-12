import {Schema, model, Document, Error, CallbackError} from "mongoose";

export interface IService extends Document {
    description: string;
    name: string;
    creator: string;
    authServer: string;
    clientId: string;
    secret: string;
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
    secret: {
        type: String
    }
},
{collection: "Service"}
);

/**
 * The entrypoint class to handle all Database access operations related to services.
 */
export default class Services {

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
     * @param completionHandler The asynchronous callback used to continue the computation after the operation has either succeeded or failed with an error
     * @throws {Error} An error representing what went wrong when attempting to create the Service
     */
    static insert(name: string, description: string, creatorID: string, authenticationServer: string, completionHandler: (error?: Error | CallbackError) => void) {
        const newService = new Services.serviceModel({
            description: description,
            name: name,
            creator: creatorID,
            authServer: authenticationServer
        });
        // Do we already have a service with the same identifier in the database?
        Services.serviceModel.exists({name: name}, (error, res) => {
            if (res == null) {
                //Proceed with the save operation
                newService.save((error) => {
                    if (error == null) {
                        console.log("Service Added!");
                    }
                    completionHandler(error);
                });
            } else if (error == null) {
                completionHandler(new Error("Model.Services ERROR: Attempting to insert a duplicate item"));
            } else {
                completionHandler(error);
            }
        });
    }

    static findServicesCreatedByUser(userID: string, successHandler: (services: IService[]) => void, errorHandler: (error: any) => void) {
        Services.serviceModel.find({creator: userID}).then((result) => {
            successHandler(result.map(doc => doc as IService));
        }, errorHandler);
    }
}