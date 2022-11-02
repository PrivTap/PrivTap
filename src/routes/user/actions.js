const express = require('express');
const router = express.Router();

/* GET endpoint for the User Actions operation */
router.get("/", (request, response) => {
	let dummyObject = [{id: "SomeActionID"}];
	response.status(200);
	response.contentType("application/json");
	response.send(JSON.stringify(dummyObject)); //ONLY FOR TESTING PURPOSES
});

module.exports = router;
