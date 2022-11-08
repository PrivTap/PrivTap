import express from "express";
const router = express.Router();

/* GET endpoint for the OAuth Redirect operation */
router.get("/", (request, response) => {
    response.status(200);
    response.send("Login: 200 OK"); //ONLY FOR TESTING PURPOSES
});

export default router;
