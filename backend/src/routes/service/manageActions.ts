import express from 'express';
const router = express.Router();

/* GET endpoint for the Manage Actions OSP operation */
router.get("/", (request, response) => {
	let dummyObject = [{id: "SomeActionID"}];
	response.status(200);
	response.contentType("application/json");
	response.send(JSON.stringify(dummyObject)); //ONLY FOR TESTING PURPOSES
});

/* POST endpoint for the Manage Actions OSP operation */
router.post("/", (request, response) => {
	let requestJSON = JSON.parse(request.body);
	console.log("Manage Actions POST: received " + requestJSON);
	response.status(200);
	response.send("Manage Actions OSP POST: 200 OK"); //ONLY FOR TESTING PURPOSES
});

/* DELETE endpoint for the Manage Actions OSP operation */
router.delete("/", (request, response) => {
	let requestJSON = JSON.parse(request.body);
	console.log("Manage Actions DELETE: received " + requestJSON);
	response.status(200);
	response.send("Manage Actions OSP DELETE: 200 OK"); //ONLY FOR TESTING PURPOSES
});

export default router;
