import express from "express";
import Service from "../../model/documents/Service";
import {checkLogin} from "../../helper/login&jwt";
import {checkURL, internalServerError} from "../../helper/helper";
import Response from "../../model/Response";
import mongoose from "mongoose";

const router = express.Router();

/* GET endpoint for the Manage Services OSP operation */
router.get("/", (request, response) => {
    checkLogin(request, response).then(
        async function (user) {
            try {
                const services = await Service.findServicesCreatedByUser(user._id.toString());
                response.status(200);
                response.send(JSON.stringify(services));
            } catch (error) {
                internalServerError(error, response);
            }
        }
    ).catch((reason) => {
        console.log(reason);
    }
    );
});

/* POST endpoint for the Manage Services OSP operation */
router.post("/", (request, response) => {
    const serviceName = request.body.name;
    const serviceDesc = request.body.description;
    //not mandatory parameters
    const serviceAuthURL = request.body.authURL;
    const clientId = request.body.clientId;
    const clientSecret = request.body.clientSecret;
    const responseContent = new Response();

    if (serviceName == null || serviceDesc == null) {
        response.status(400);
        responseContent.status = false;
        responseContent.message = "400: Invalid Parameters";
        response.send(responseContent);
        return;
    }
    //if one of the three camp is present then all three of them should be present
    let optionalParameter = false;
    const clientIdValid = clientId != null;
    const clientSecretValid = clientSecret != null;
    let authURLValid = serviceAuthURL != null;
    if (authURLValid || clientIdValid || clientSecretValid) {
        authURLValid = authURLValid && checkURL(serviceAuthURL);
        optionalParameter = true;
        // Validate the authentication url
        if (!authURLValid || !clientIdValid || !clientSecretValid) {
            response.status(400);
            responseContent.status = false;
            responseContent.message = "400: Invalid Parameters";
            response.send(responseContent);
            return;
        }
    }
    checkLogin(request, response).then(
        async function (user)
        // Carry on with service creation if the user is logged in
        {
            try {
                // Insert the service
                await Service.insert(serviceName, serviceDesc, user._id.toString(),
                    optionalParameter ? serviceAuthURL : undefined, optionalParameter ? clientId : undefined, optionalParameter ? clientSecret : undefined);
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
        }).catch((reason) => {
        console.log(reason);
    }
    );
});

/* DELETE endpoint for the Manage Services OSP operation */
router.delete("/", (request, response) => {
    const serviceID = request.body.serviceID;
    const responseContent = new Response();

    if (serviceID == null || !mongoose.isValidObjectId(serviceID)) {
        response.status(400);
        responseContent.status = false;
        responseContent.message = "400: Invalid Parameters";
        response.send(responseContent);
        return;
    }

    checkLogin(request, response).then(
        async function (user) {
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
        }).catch((reason) => {
        console.log(reason);
    });
});

export default router;
