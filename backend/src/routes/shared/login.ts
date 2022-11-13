import express from "express";
import bcrypt from "bcrypt";
import User from "../../model/User";
import {createJWT} from "../../helper/login&jwt";
import {internalServerError} from "../../helper/helper";

const router = express.Router();

/* POST endpoint for the Login operation */
router.post("/", (request, response) => {
    const username = request.body.username;
    const password = request.body.password;
    if (typeof username == "undefined" || typeof password == "undefined") {
        response.status(400);
        response.send("400: Undefined parameters");
        return;
    }

    User.queryUser("username", username).then((user) => {
        if (user == null) {
            response.status(400);
            // Username not found
            response.send("400: Wrong credentials");
            return;
        }
        const passwordValid = bcrypt.compareSync(password, user.password);
        if (!passwordValid) {
            response.status(400);
            // Wrong password
            response.send("400: Wrong credentials");
            return;
        }
        const jwt = createJWT(user);
        if (typeof jwt == "undefined") {
            internalServerError("Internal server error for JWT", response);
            return;
        }
        response.cookie("_jwt", jwt);
        response.status(200);
        response.send("Login: 200 OK");
    });
});

export default router;