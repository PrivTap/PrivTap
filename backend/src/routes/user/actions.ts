import express from "express";
const router = express.Router();

/* GET endpoint for the User Actions operation */
router.get("/", (request, response) => {
    const dummyObject = [{id: "SomeActionID"}];
    response.status(200);
    response.contentType("application/json");
    response.send(JSON.stringify(dummyObject)); //ONLY FOR TESTING PURPOSES
});

export default router;
