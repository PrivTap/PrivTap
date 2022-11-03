const express = require('express');
const router = express.Router();

/* GET endpoint for the Manage Services OSP operation */
router.get("/", (request, response) => {
	let dummyObject = [{id: "SomeServiceID"}];
	response.status(200);
	response.contentType("application/json");
	response.send(JSON.stringify(dummyObject)); //ONLY FOR TESTING PURPOSES
});

/* POST endpoint for the Manage Services OSP operation */
router.post("/", (request, response) => {
	let requestJSON = JSON.parse(request.body);
	console.log("Manage Services POST: received " + requestJSON);
	response.status(200);
	response.send("Manage Services OSP POST: 200 OK"); //ONLY FOR TESTING PURPOSES
});

/* DELETE endpoint for the Manage Services OSP operation */
router.delete("/", (request, response) => {
	let requestJSON = JSON.parse(request.body);
	console.log("Manage Services DELETE: received " + requestJSON);
	response.status(200);
	response.send("Manage Services OSP DELETE: 200 OK"); //ONLY FOR TESTING PURPOSES
});

module.exports = router;
