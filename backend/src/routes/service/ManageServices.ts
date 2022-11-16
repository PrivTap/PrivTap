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
        try {
            const services = await Service.findServicesCreatedByUser(request.userId.toString());
            response.status(200);
            response.send(JSON.stringify(services));
        } catch (error) {
            internalServerError(response);
        }
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const serviceName = request.body.name;
        const serviceDesc = request.body.description;

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
        let authURLValid = serviceAuthURL != null;
        if (authURLValid || clientIdValid || clientSecretValid) {
            authURLValid = authURLValid && checkURL(serviceAuthURL);
            hasOptionalParameters = true;

            if (!(authURLValid && clientIdValid && clientSecretValid)) {
                badRequest(response, "Invalid parameter");
                return;
            }
        }
        try {
            // Insert the service
            await Service.insert(serviceName, serviceDesc, request.userId.toString(),
                hasOptionalParameters ? serviceAuthURL : undefined, hasOptionalParameters ? clientId : undefined, hasOptionalParameters ? clientSecret : undefined);
            success(response);
        } catch (error) {
            //this is for duplicated data
            badRequest(response, "Service with this name already exist");
        }
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const serviceID = request.body.serviceID;

        if (serviceID == null || !mongoose.isValidObjectId(serviceID)) {
            badRequest(response, "Invalid parameter");
            return;
        }
        try {
            const service = await Service.findServiceCreatedByUser(request.userId.toString(), serviceID.toString());
            if (service != null) {
                await Service.deleteService(request.userId.toString(), serviceID);
                success(response);
            } else {
                forbiddenUserError(response, "You can't delete this service");
            }
        } catch (error) {
            internalServerError(response);
        }
    }

    protected registerAdditionalHTTPMethods(router: express.Router) {
        router.post("/add-auth-server", async (request, response) => {
            const serviceID = request.body.serviceID;
            const serviceAuthURL = request.body.authURL;
            const clientID = request.body.clientID;
            const clientSecret = request.body.clientSecret;
            if (serviceAuthURL == null || serviceID == null || clientID == null || clientSecret == null || !mongoose.isValidObjectId(serviceID)) {
                badRequest(response, "Invalid parameter");
                return;
            }
            if (!checkURL(serviceAuthURL)) {
                badRequest(response, "Invalid parameter");
                return;
            }
            try {
                const service = await Service.findServiceCreatedByUser(request.userId, serviceID);
                if (service == null) {
                    forbiddenUserError(response, "You are not authorized to check this resource");
                    return;
                }
                await Service.addAuthServer(service, serviceAuthURL, clientID, clientSecret);
                success(response);
            } catch (error) {
                internalServerError(response);
            }
        });
    }
}