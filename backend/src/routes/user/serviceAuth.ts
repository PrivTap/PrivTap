import express from "express";
const router = express.Router();

/* GET endpoint for the Service Authorization operation */
router.get("/", (request, response) => {
    const dummyObject = [{id: "SomePermissionID"}];
    response.status(200);
    response.contentType("application/json");
    response.send(JSON.stringify(dummyObject)); //ONLY FOR TESTING PURPOSES
});

/* POST endpoint for the Service Authorization operation */
router.post("/", (request, response) => {
    const requestJSON = JSON.parse(request.body);
    console.log("Service Authorization POST: received " + requestJSON);
    response.status(200);
    response.send("Service Authorization POST: 200 OK"); //ONLY FOR TESTING PURPOSES
});

/* DELETE endpoint for the Service Authorization operation */
router.delete("/", (request, response) => {
    const requestJSON = JSON.parse(request.body);
    console.log("Service Authorization DELETE: received " + requestJSON);
    response.status(200);
    response.send("Service Authorization DELETE: 200 OK"); //ONLY FOR TESTING PURPOSES
});

export default router;
