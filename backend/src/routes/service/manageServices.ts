import express from "express";
import Service from "../../model/Service";
import {checkLogin} from "../../helper/authentication";
import {checkURL, internalServerError, unauthenticatedUserError} from "../../helper/helper";
import APIResponse from "../../APIResponse";
import mongoose from "mongoose";

const router = express.Router();


/* GET endpoint for the Manage Services OSP operation */
router.get("/", (request, response) => {
    checkLogin(request, response).then(async (user) => {
        try {
            const services = await Service.findServicesCreatedByUser(user._id.toString());
            response.status(200);
            response.send(JSON.stringify(services));
        } catch (error) {
            internalServerError(error, response);
        }
    }).catch((error) => {
        console.log(error);
        unauthenticatedUserError(response);
    });
});

/* POST endpoint for the Manage Services OSP operation */
router.post("/", (request, response) => {
    const serviceName = request.body.name;
    const serviceDesc = request.body.description;

    // Optional Parameters
    const serviceAuthURL = request.body.authURL;
    const clientId = request.body.clientId;
    const clientSecret = request.body.clientSecret;
    const responseContent = new APIResponse();

    if (serviceName == null || serviceDesc == null) {
        response.status(400);
        responseContent.status = false;
        responseContent.message = "400: Invalid Parameters";
        response.send(responseContent);
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
            response.status(400);
            responseContent.status = false;
            responseContent.message = "400: Invalid Parameters";
            response.send(responseContent);
            return;
        }
    }

    checkLogin(request, response).then(async (user) => {
        // Carry on with service creation if the user is logged in
        try {
            // Insert the service
            await Service.insert(serviceName, serviceDesc, user._id.toString(),
                hasOptionalParameters ? serviceAuthURL : undefined, hasOptionalParameters ? clientId : undefined, hasOptionalParameters ? clientSecret : undefined);
            response.status(200);
            responseContent.status = true;
            responseContent.message = "200: Service Creation OK";
            response.send(responseContent);
        } catch (error) {
            //this is for duplicated data
            response.status(400);
            responseContent.status = false;
            responseContent.message = "400: Can't create this service" + (error instanceof Error ? (" because " + error.message) : "");
            response.send(responseContent);
        }
    }).catch((error) => {
        console.log(error);
        unauthenticatedUserError(response);
    });
});

/* DELETE endpoint for the Manage Services OSP operation */
router.delete("/", (request, response) => {
    const serviceID = request.body.serviceID;
    const responseContent = new APIResponse();

    if (serviceID == null || !mongoose.isValidObjectId(serviceID)) {
        response.status(400);
        responseContent.status = false;
        responseContent.message = "400: Invalid Parameters";
        response.send(responseContent);
        return;
    }

    checkLogin(request, response).then(async (user) => {
        try {
            const service = await Service.findServiceCreatedByUser(user._id.toString(), serviceID.toString());
            if (service != null) {
                await Service.deleteService(user._id.toString(), serviceID);
                response.status(200);
                response.send("200: Delete service OK");
            } else {
                response.status(403);
                responseContent.status = false;
                responseContent.message = "400: You cannot delete this service";
                response.send(responseContent);
            }
        } catch (error) {
            internalServerError(error, response);
        }
    }).catch((error) => {
        console.log(error);
        unauthenticatedUserError(response);
    });
});

export default router;
