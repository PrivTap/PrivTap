
import Service from "../../model/Service";
import { Request, Response } from "express";
import Route from "../../Route";
import { badRequest, checkUndefinedParams, forbiddenUserError, internalServerError, success } from "../../helper/http";


export default class ManageServices extends Route {
    constructor() {
        super("manageServices", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const services = await Service.findServicesCreatedByUser(request.userId.toString());
        if (services) {
            success(response,  services);
        } else {
            internalServerError(response);
        }
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const name = request.body.name;
        const description = request.body.description;
        const authURL = request.body.authURL;
        const clientId = request.body.clientId;
        const clientSecret = request.body.clientSecret;

        if(checkUndefinedParams(response, name, description, authURL, clientId, clientSecret))
            return;

        // Insert the service
        const validInsertion = await Service.insert(name, description, request.userId.toString(),authURL, clientId, clientSecret);
        if (!validInsertion) {
            badRequest(response, "Error while creating service");
            return;
        }
        success(response);
        return;

    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const serviceID = request.body.serviceId;

        if(checkUndefinedParams(response, serviceID))
            return;

        console.log(request.userId.toString());
        const validDeletion = await Service.deleteService(request.userId.toString(), serviceID.toString());
        if (!validDeletion){
            badRequest(response, "Error deleting the specified service");
            return ;
        }

        success(response);
    }

    protected async httpPut(request: Request, response: Response): Promise<void> {
        const serviceID = request.body.serviceID;
        const newServiceName = request.body.name;
        const newServiceDescription = request.body.description;
        const newServiceAuthURL = request.body.authURL;
        const newClientID = request.body.clientID;
        const newClientSecret = request.body.clientSecret;

        if(checkUndefinedParams(response, serviceID)){
            return;
        }

        const validModification = Service.updateService(request.userId, serviceID, newServiceName, newServiceDescription, newServiceAuthURL, newClientID, newClientSecret);

        if(!validModification)
            forbiddenUserError(response);
        else
            success(response);
    }
}