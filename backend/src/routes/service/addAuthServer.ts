import express from "express";
import {checkURL, internalServerError} from "../../helper/helper";
import {checkLogin} from "../../helper/login&jwt";
import Service from "../../model/documents/Service";

const router = express.Router();

/* POST endpoint for adding an authorization server to a service */
router.post("/", (request, response) => {
    checkLogin(request, response, function (user) {
        const serviceID = request.body.serviceID;
        const serviceAuthURL = request.body.authURL;
        const clientId = request.body.clientId;
        const clientSecret = request.body.clientSecret;
        if (serviceAuthURL == null || serviceID == null || clientId == null || clientSecret == null) {
            console.log("url+ ", serviceAuthURL, " clientId+ ", clientId, "clientSecret+ ", clientSecret);
            response.status(400);
            response.send("400: Bad Request. The parameters you sent were invalid.");
            return;
        }
        if (!checkURL(serviceAuthURL)) {
            response.status(400);
            response.send("400: Bad Request. The parameters you sent were invalid.");
            return;
        }
        Service.findServiceCreatedByUser(user._id, serviceID, function (service) {
            if (service == null) {
                response.status(403);
                response.send("You are not authorized to check this resource");
                return;
            }
            Service.addAuthServer(service, serviceAuthURL, clientId, clientSecret, function () {
                response.status(200);
                response.send("AddAuthenticationServerToAService: OK");
            }
            , function (error) {
                internalServerError(error, response);
            });
        }, function (error) {
            internalServerError(error, response);
        });
    });
});

export default router;
