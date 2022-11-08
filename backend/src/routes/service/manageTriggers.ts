import express from 'express';
const router = express.Router();

/* GET endpoint for the Manage Triggers OSP operation */
router.get("/", (request, response) => {
	let dummyObject = [{id: "SomeTriggerID"}];
	response.status(200);
	response.contentType("application/json");
	response.send(JSON.stringify(dummyObject)); //ONLY FOR TESTING PURPOSES
});

/* POST endpoint for the Manage Triggers OSP operation */
router.post("/", (request, response) => {
	let requestJSON = JSON.parse(request.body);
	console.log("Manage Triggers POST: received " + requestJSON);
	response.status(200);
	response.send("Manage Triggers OSP POST: 200 OK"); //ONLY FOR TESTING PURPOSES
});

/* DELETE endpoint for the Manage Triggers OSP operation */
router.delete("/", (request, response) => {
	let requestJSON = JSON.parse(request.body);
	console.log("Manage Triggers DELETE: received " + requestJSON);
	response.status(200);
	response.send("Manage Triggers OSP DELETE: 200 OK"); //ONLY FOR TESTING PURPOSES
});

export default router;
