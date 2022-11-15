import express from "express";
import {checkURL, internalServerError, unauthenticatedUserError} from "../../helper/helper";
import {checkLogin} from "../../helper/authentication";
import Service from "../../model/Service";
import mongoose from "mongoose";

const router = express.Router();

/* POST endpoint for adding an authorization server to a service */
router.post("/", (request, response) => {
    checkLogin(request, response).then(async (user) => {
        const serviceID = request.body.serviceID;
        const serviceAuthURL = request.body.authURL;
        const clientId = request.body.clientId;
        const clientSecret = request.body.clientSecret;
        if (serviceAuthURL == null || serviceID == null || clientId == null || clientSecret == null || !mongoose.isValidObjectId(serviceID)) {
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
        try {
            const service = await Service.findServiceCreatedByUser(user._id, serviceID);
            if (service == null) {
                response.status(403);
                response.send("403: You are not authorized to check this resource");
                return;
            }
            await Service.addAuthServer(service, serviceAuthURL, clientId, clientSecret);
            response.status(200);
            response.send("200: Add Authentication Server OK");
        } catch (error) {
            internalServerError(error, response);
        }
    }).catch(function (reason) {
        console.log(reason);
        unauthenticatedUserError(response);
    });
});

export default router;
