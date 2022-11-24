
import Service, { IService } from "../../model/Service";
import { Request, Response } from "express";
import Route from "../../Route";
import { badRequest, checkUndefinedParams, forbiddenUserError, internalServerError, success } from "../../helper/http";
import { ModelError } from "../../helper/model";


export default class ManageServices extends Route {
    constructor() {
        super("manageServices", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const serviceId = request.params.serviceId;

        let data: IService | IService[] = [];

        // If the serviceId parameter is defined return only info about that service
        // Else return info about all services created by the user
        if (serviceId) {
            // Check that the user is the owner of the service
            if (!await Service.isCreator(request.userId, serviceId)) {
                forbiddenUserError(response, "You are not the owner of this service");
                return;
            }

            const res = await Service.findById(serviceId);
            if (!res) {
                return;
            }
            data = res;
        } else {
            const res = await Service.findAllForUser(request.userId);
            if (!res) {
                return;
            }
            data = res;
        }

        success(response,  data);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const name = request.body.name;
        const description = request.body.description;
        const authURL = request.body.authURL;
        const clientId = request.body.clientId;
        const clientSecret = request.body.clientSecret;

        if(checkUndefinedParams(response, name, description)) return;

        // Insert the service
        try {
            const validInsertion = await Service.insert(name, description, request.userId,authURL, clientId, clientSecret);
            if (!validInsertion) {
                internalServerError(response);
                return;
            }
        } catch (e) {
            if (e instanceof ModelError) {
                badRequest(response, e.message);
            }
            return;
        }

        success(response);
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const serviceId = request.body.serviceId;

        if(checkUndefinedParams(response, serviceId)) return;

        // Check that the user is the owner of the service
        if (!await Service.isCreator(request.userId, serviceId)) {
            forbiddenUserError(response, "You are not the owner of this service");
            return;
        }

        const validDeletion = await Service.deleteService(serviceId);
        if (!validDeletion){
            badRequest(response, "This service does not exist");
            return;
        }

        success(response);
    }

    protected async httpPut(request: Request, response: Response): Promise<void> {
        const serviceId = request.body.serviceId;
        const name = request.body.name;
        const description = request.body.description;
        const authServer = request.body.authURL;
        const clientId = request.body.clientId;
        const clientSecret = request.body.clientSecret;

        if(checkUndefinedParams(response, serviceId)) return;

        // Check that the user is the owner of the service
        if (!await Service.isCreator(request.userId, serviceId)) {
            forbiddenUserError(response, "You are not the owner of this service");
            return;
        }

        try {
            const validModification = await Service.update(serviceId,
                { name, description, authServer, clientId, clientSecret });
            if(!validModification) {
                badRequest(response, "A service with this id does not exist");
                return;
            }
        } catch (e) {
            if (e instanceof ModelError) {
                badRequest(response, e.message);
            }
            return;
        }

        success(response);
    }
}