const express = require('express');
const passport = require('passport');


const Feed = require('../../models/Feed');

const router = express.Router();

router.post('/addfeed', passport.authenticate('jwt', { session: false }), (request, response) => {
    const newFeed = new Feed({
        userId: request.user._id,
        content: request.body.content,
    });
    newFeed.save()
    .then(feed => response.json(feed))
    .catch(error => response.json({ status: 'error', data: error }));
})

module.exports = router;