const express = require('express');
const router = express.Router();

/* GET endpoint for the Rule Management operation */
router.get("/", (request, response) => {
	let dummyObject = [{trigger: {id: "SomeTriggerID"}, action: {id: "SomeActionID"}}];
	response.status(200);
	response.contentType("application/json");
	response.send(JSON.stringify(dummyObject)); //ONLY FOR TESTING PURPOSES
});

/* POST endpoint for the Rule Management operation */
router.post("/", (request, response) => {
	let requestJSON = JSON.parse(request.body);
	console.log("User Rule Management POST: received " + requestJSON);
	response.status(200);
	response.send("User Rule Management POST: 200 OK"); //ONLY FOR TESTING PURPOSES
});

/* DELETE endpoint for the Rule Management operation */
router.delete("/", (request, response) => {
	let requestJSON = JSON.parse(request.body);
	console.log("User Rule Management DELETE: received " + requestJSON);
	response.status(200);
	response.send("User Rule Management DELETE: 200 OK"); //ONLY FOR TESTING PURPOSES
});

module.exports = router;
