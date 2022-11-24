
import Service, { IService } from "../../model/Service";
import { Request, Response } from "express";
import Route from "../../Route";
import { badRequest, checkUndefinedParams, forbiddenUserError, internalServerError, success } from "../../helper/http";
import { handleInsert, handleUpdate } from "../../helper/misc";


export default class ManageServices extends Route {
    constructor() {
        super("manage-services");
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

            const service = await Service.findById(serviceId);
            if (!service) {
                badRequest(response, "A service with this id does not exists");
                return;
            }
            data = service;
        } else {
            const services = await Service.findAllForUser(request.userId);
            if (!services) {
                internalServerError(response);
                return;
            }
            data = services;
        }

        success(response,  data);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const name = request.body.name;
        const description = request.body.description;
        const authServer = request.body.authServer;
        const clientId = request.body.clientId;
        const clientSecret = request.body.clientSecret;

        if(checkUndefinedParams(response, name, description)) return;

        // Insert the service
        if (!await handleInsert(response, Service,
            { name, description, creator: request.userId, authServer, clientId, clientSecret })) return;

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

        const validDeletion = await Service.delete(serviceId);
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
        const authServer = request.body.authServer;
        const clientId = request.body.clientId;
        const clientSecret = request.body.clientSecret;

        if(checkUndefinedParams(response, serviceId)) return;

        // Check that the user is the owner of the service
        if (!await Service.isCreator(request.userId, serviceId)) {
            forbiddenUserError(response, "You are not the owner of this service");
            return;
        }

        if (!await handleUpdate(response, Service, { _id: serviceId },
            { name, description, authServer, clientId, clientSecret })) return;

        success(response);
    }
}