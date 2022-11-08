import express from 'express';
const router = express.Router();

/* POST endpoint for the Login operation */
router.post("/", (request, response) => {
    response.status(200);
    response.send("Login: 200 OK"); //ONLY FOR TESTING PURPOSES
});

export default router;