import express from "express";
import Services from "../../model/Service";
import {checkLogin} from "../../helper/login&jwt";
const router = express.Router();

/* GET endpoint for the Manage Services OSP operation */
router.get("/", (request, response) => {
    checkLogin(request, response, (user) => {
        Services.findServicesCreatedByUser(user._id.toString(), (services) => {
            response.status(200);
            response.send(JSON.stringify(services));
        }, (error) => {
            response.status(500);
            response.send("500 Internal Server Error: The server encountered the following error while processing the request.\n" + error);
        });
    });
});

/* POST endpoint for the Manage Services OSP operation */
router.post("/", (request, response) => {
    const serviceName = request.body.name;
    const serviceDesc = request.body.description;
    const serviceAuthURL = request.body.authURL;

    if (serviceName == null || serviceDesc == null || serviceAuthURL == null) {
        response.status(400);
        response.send("400: Bad Request. The parameters you sent were invalid.");
        return;
    }

    // Validate the authentication url
    const authURLValid = /^(http|https):\/\/[^ "]+$/.test(serviceAuthURL);
    if (!authURLValid) {
        response.status(400);
        response.send("400: Bad Request. The parameters you sent were invalid.");
        return;
    }

    // Carry on with service creation if the user is logged in
    checkLogin(request, response, (user) => {
        // Insert the service
        Services.insert(serviceName, serviceDesc, user._id.toString(), serviceAuthURL, (error) => {
            if (error == null) {
                response.status(200);
                response.send("200 OK");
            } else {
                response.status(500);
                response.send("500: Internal Server Error. The server encountered the following error:\n" + error.message);
            }
        });
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
        Services.findServiceCreatedByUser(user._id.toString(), serviceID, () => {
            Services.deleteService(user._id.toString(), serviceID, () => {
                response.status(200);
                response.send("Delete service: 200 OK");
            }, (error) => {
                response.status(500);
                response.send("500 Internal Server Error: The server encountered the following error while processing the request.\n" + error);
            });
        }, (error) => {
            response.status(500);
            response.send("500 Internal Server Error: The server encountered the following error while processing the request.\n" + error);
        });
    });
});

export default router;
