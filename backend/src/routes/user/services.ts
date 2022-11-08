import express from "express"
const router = express.Router();

/* GET endpoint for the Get Services operation */
router.get("/", (request, response) => {
	let dummyObject = [{id: "SomeServiceID", authorized: true}];
	response.status(200);
	response.contentType("application/json");
	response.send(JSON.stringify(dummyObject)); //ONLY FOR TESTING PURPOSES
});

export default router
