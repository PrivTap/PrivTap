import express from "express";
import User from "../../model/User";
import APIResponse from "../../APIResponse";
import {internalServerError} from "../../helper/helper";

const router = express.Router();

router.post("/", (request, response) => {
    const responseMessage: APIResponse = new APIResponse();
    const activationToken = request.body.token;
    if (typeof activationToken == "undefined") {
        response.status(400);
        responseMessage.status = false;
        responseMessage.message = "400: Undefined parameters";
        response.send(responseMessage);
        return;
    }
    User.modifyUser("activationToken", activationToken, "isConfirmed", true).then(result => {
        const modifiedCount = result["modifiedCount"];
        const matchedCount = result["matchedCount"];
        if (matchedCount == 0) {
            // No matching token in the DB
            response.status(400);
            responseMessage.status = false;
            responseMessage.message = "400: Wrong activation token";
            response.send(responseMessage);
            return;
        }
        if (modifiedCount == 0) {
            // User has already confirmed its account
            response.status(200);
            responseMessage.message = "200: Account already activated";
            response.send(responseMessage);
            return;
        }
        response.status(200);
        responseMessage.message = "200: Account activated";
        response.send(responseMessage);
    }).catch((error) => {
        internalServerError(error, response);
    });
});

export default router;