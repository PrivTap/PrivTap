import express from "express";
import Service from "../../model/Service";
import { Request, Response } from "express";
import { checkURL } from "../../helper/misc";
import mongoose from "mongoose";
import Route from "../../Route";
import { badRequest, forbiddenUserError, internalServerError, success } from "../../helper/http";


export default class ManageServices extends Route {
    constructor() {
        super("manageServices", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const services = await Service.findServicesCreatedByUser(request.userId.toString());
        if (services) {
            success(response, services );
        } else {
            internalServerError(response);
        }
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const serviceName = request.body.name;
        const serviceDesc = request.body.description;

        // TODO: Shouldn't we check the jwt?

        // Optional Parameters
        const serviceAuthURL = request.body.authURL;
        const clientId = request.body.clientId;
        const clientSecret = request.body.clientSecret;
        if (serviceName == null || serviceDesc == null) {
            badRequest(response, "Invalid parameter");
            return;
        }

        // If one of the three optional params is present then we need all three of them
        let hasOptionalParameters = false;
        const clientIdValid = clientId != null;
        const clientSecretValid = clientSecret != null;
        const authURLValid = serviceAuthURL != null && checkURL(serviceAuthURL);
        if (authURLValid || clientIdValid || clientSecretValid) {
            if (!(authURLValid && clientIdValid && clientSecretValid)) {
                badRequest(response, "Invalid parameter");
                return;
            }
            hasOptionalParameters = true;
        }

        // Insert the service
        if (await Service.insert(serviceName, serviceDesc, request.userId.toString(),
            hasOptionalParameters ? serviceAuthURL : undefined, hasOptionalParameters ? clientId : undefined, hasOptionalParameters ? clientSecret : undefined)) {
            success(response);
        } else {
            badRequest(response, "Error while creating service");
        }
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const serviceID = request.body.serviceID;

        if (serviceID == null || !mongoose.isValidObjectId(serviceID)) {
            badRequest(response, "Invalid parameter");
            return;
        }

        const service = await Service.findServiceCreatedByUser(request.userId.toString(), serviceID.toString());
        if (service != null) {
            if (await Service.deleteService(request.userId.toString(), serviceID)) {
                success(response);
            } else {
                internalServerError(response);
            }
        } else {
            forbiddenUserError(response, "You can't delete this service");
        }
    }

    protected registerAdditionalHTTPMethods(router: express.Router) {
        router.put("/", async (request, response) => {
            const serviceID = request.body.serviceID;
            const serviceAuthURL = request.body.authURL;
            const clientID = request.body.clientID;
            const clientSecret = request.body.clientSecret;
            const newServiceName = request.body.name;
            const newServiceDescription = request.body.description;

            let parametersValid = true;

            if (!serviceID || !mongoose.isValidObjectId(serviceID)) {
                parametersValid = false;
            }
            if (clientID || clientSecret) {
                parametersValid = parametersValid && (clientID && clientSecret);
            }
            if (serviceAuthURL && !checkURL(serviceAuthURL)) {
                parametersValid = false;
            }

            if (!parametersValid) {
                badRequest(response, "Invalid parameters");
                return;
            }

            const service = await Service.findServiceCreatedByUser(request.userId, serviceID);

            if (service == null) {
                forbiddenUserError(response, "You are not authorized to check this resource");
                return;
            }

            const result = await Service.updateService(serviceID, newServiceName, newServiceDescription, serviceAuthURL, clientID, clientSecret);

            if (result) {
                success(response);
            } else {
                internalServerError(response);
            }
        });
    }
}