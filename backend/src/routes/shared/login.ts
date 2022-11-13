import express from "express";
import bcrypt from "bcrypt";
import User from "../../model/documents/User";
import {createJWT} from "../../helper/login&jwt";
import {internalServerError} from "../../helper/helper";
import Response from "../../model/Response";

const router = express.Router();

/* POST endpoint for the Login operation */
router.post("/", (request, response) => {
    const responseMessage: Response = new Response();
    const username = request.body.username;
    const password = request.body.password;
    if (typeof username == "undefined" || typeof password == "undefined") {
        response.status(400);
        responseMessage.status = false;
        responseMessage.message = "400: Undefined parameters";
        response.send(responseMessage);
        return;
    }

    User.queryUser("username", username).then((user) => {
        if (user == null) {
            response.status(400);
            responseMessage.status = false;
            responseMessage.message = "400: Wrong credentials";
            // Username not found
            response.send(responseMessage);
            return;
        }
        const passwordValid = bcrypt.compareSync(password, user.password);
        if (!passwordValid) {
            response.status(400);
            responseMessage.status = false;
            responseMessage.message = "400: Wrong credentials";
            // Wrong password
            response.send(responseMessage);
            return;
        }
        const jwt = createJWT(user);
        if (typeof jwt == "undefined") {
            internalServerError("Internal server error for JWT", response);
            return;
        }
        response.cookie("_jwt", jwt);
        response.status(200);
        responseMessage.message = "Login: 200 OK";
        responseMessage.data = {"username": username, "email": user.email, "isConfirmed": user.isConfirmed};
        response.send(responseMessage);
    });
});

export default router;