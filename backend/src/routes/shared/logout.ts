import express from "express"
const router = express.Router();

/* GET endpoint for the Logout operation */
router.get('/', (request, response) => {
    response.status(200);
    response.send("Logout: 200 OK"); //ONLY FOR TESTING PURPOSES
});

export default router;
