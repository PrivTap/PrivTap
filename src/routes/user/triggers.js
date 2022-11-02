const express = require('express');
const router = express.Router();

/* GET endpoint for the Get Triggers operation */
router.get("/", (request, response) => {
	let dummyObject = [{id: "SomeTriggerID"}];
	response.status(200);
	response.contentType("application/json");
	response.send(JSON.stringify(dummyObject)); //ONLY FOR TESTING PURPOSES
});

module.exports = router;
