import express from "express";
import Service from "../../model/documents/Service";
import {checkLogin} from "../../helper/login&jwt";
import {checkURL, internalServerError} from "../../helper/helper";

const router = express.Router();

/* GET endpoint for the Manage Services OSP operation */
router.get("/", (request, response) => {
    checkLogin(request, response, (user) => {
        Service.findServicesCreatedByUser(user._id.toString(), (services) => {
            response.status(200);
            response.send(JSON.stringify(services));
        }, (error) => {
            internalServerError(error, response);
        });
    });
});

/* POST endpoint for the Manage Services OSP operation */
router.post("/", (request, response) => {
    const serviceName = request.body.name;
    const serviceDesc = request.body.description;
    //not mandatory parameters
    const serviceAuthURL = request.body.authURL;
    const clientId = request.body.clientId;
    const clientSecret = request.body.clientSecret;

    if (serviceName == null || serviceDesc == null) {
        response.status(400);
        response.send("400: Bad Request. The parameters you sent were invalid.");
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
            response.send("400: Bad Request. The parameters you sent were invalid.");
            return;
        }
    }

    // Carry on with service creation if the user is logged in
    checkLogin(request, response, (user) => {
        // Insert the service
        Service.insert(serviceName, serviceDesc, user._id.toString(), (error) => {
            if (error == null) {
                response.status(200);
                response.send("200 OK");
            } else {
                //this is for duplicated data
                response.status(400);
                response.send(error.message);
            }
        }, optionalParameter ? serviceAuthURL : undefined, optionalParameter ? clientId : undefined, optionalParameter ? clientSecret : undefined);
    });
});

/* DELETE endpoint for the Manage Services OSP operation */
router.delete("/", (request, response) => {
    const serviceID = request.body.serviceID;

    if (serviceID == null) {
        response.status(400);
        response.send("400 Bad Request. Could not find the service ID to delete");
        return;
    }

    checkLogin(request, response, (user) => {
        Service.findServiceCreatedByUser(user._id.toString(), serviceID, () => {
            Service.deleteService(user._id.toString(), serviceID, () => {
                response.status(200);
                response.send("Delete service: 200 OK");
            }, (error) => {
                internalServerError(error, response);
            });
        }, (error) => {
            internalServerError(error, response);
        });
    });
});

export default router;
