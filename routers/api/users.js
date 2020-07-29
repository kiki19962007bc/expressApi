const express = require('express');
const User = require('../../models/User');
const router = express.Router();

router.get('/', (request, response) => {
    User.find({}, (error, users) => {
        response.json(users);
    });
});
module.exports = router;