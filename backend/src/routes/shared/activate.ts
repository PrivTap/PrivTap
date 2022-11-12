import express from "express";
import User from "../../model/User";
const router = express.Router();

router.post("/", (request, response) => {
    const activationToken = request.body.token;
    if (typeof activationToken == "undefined"){
        response.status(400);
        response.send("400: Undefined parameters");
        return;
    }
    User.modifyUser("activationToken", activationToken, "isConfirmed", true).then(result => {
        const modifiedCount = result["modifiedCount"];
        const matchedCount = result["matchedCount"];
        if (matchedCount == 0){
            // No matching token in the DB
            response.status(400);
            response.send("400: Wrong activation token");
            return;
        }
        if (modifiedCount == 0){
            // User has already confirmed its account
            response.status(200);
            response.send("200: Account already activated");
            return;
        }
        response.status(200);
        response.send("200: Account activated");
    });
});

export default router;