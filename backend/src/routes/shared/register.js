const express = require('express');
const router = express.Router();

/* POST endpoint for the Register operation */
router.post("/", (request, response) => {
    response.status(200);
    response.send("Register: 200 OK"); //ONLY FOR TESTING PURPOSES
});

module.exports = router;
