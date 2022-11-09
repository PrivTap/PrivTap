import express from "express";
const router = express.Router();

/* POST endpoint for the OSP sending Trigger Data operation */
router.post("/", (request, response) => {
    const requestJSON = JSON.parse(request.body);
    console.log("Trigger Data POST: received " + requestJSON);
    response.status(200);
    response.send("Trigger Data: 200 OK"); //ONLY FOR TESTING PURPOSES
});

export default router;
