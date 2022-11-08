import express from "express";
const router = express.Router();

/* GET endpoint for the Get Triggers operation */
router.get("/", (request, response) => {
    const dummyObject = [{id: "SomeTriggerID"}];
    response.status(200);
    response.contentType("application/json");
    response.send(JSON.stringify(dummyObject)); //ONLY FOR TESTING PURPOSES
});

export default router;