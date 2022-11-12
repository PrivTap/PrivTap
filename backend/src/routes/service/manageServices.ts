import express from "express";
import Services from "../../model/Service";
import {checkLogin} from "../../helper/login&jwt";
const router = express.Router();

/* GET endpoint for the Manage Services OSP operation */
router.get("/", (request, response) => {
    const dummyObject = [{id: "SomeServiceID"}];
    response.status(200);
    response.contentType("application/json");
    response.send(JSON.stringify(dummyObject)); //ONLY FOR TESTING PURPOSES
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
    checkLogin(request, response, () => {
        // Insert the service
        Services.insert(serviceName, serviceDesc, serviceAuthURL, (error) => {
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
    const requestJSON = JSON.parse(request.body);
    console.log("Manage Services DELETE: received " + requestJSON);
    response.status(200);
    response.send("Manage Services OSP DELETE: 200 OK"); //ONLY FOR TESTING PURPOSES
});

export default router;
