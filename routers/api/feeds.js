const express = require('express');
const passport = require('passport');

const Feed = require('../../models/Feed');

const router = express.Router();

router.post('/add', passport.authenticate('jwt', { session: false }), (request, response) => {
    const newFeed = new Feed({
        userId: request.user._id,
        content: request.body.content,
    });
    newFeed.save()
        .then(feed => response.json(feed))
        .catch(error => response.json({ status: 'error', data: error }));
});

router.post('/edit/:id', passport.authenticate('jwt', { session: false }), (request, response) => {
    const id = request.params.id;
    const content = request.body.content;
    Feed.findById(id)
        .then(feed => {
            if (feed) {
                if (feed.userId == request.user._id) {
                    feed.content = request.body.content
                    feed.save()
                        .then(feed => response.json({ data: feed, message: '已修改' }))
                        .catch(error => response.json({ status: 'error', data: error }));
                }
                else {
                    response.json({ status: 'error', data: '登入ID不一致' })
                }
            }
            else {
                response.json({ status: 'error', data: '無此篇文章' })
            }
        });
});

router.get('/delete/:id', passport.authenticate('jwt', { session: false }), (request, response) => {
    const id = request.params.id;
    Feed.findById(id)
        .then(feed => {
            if (feed) {
                if (feed.userId == request.user._id) {
                    Feed.findOneAndDelete({ _id: id },)
                        .then(feed => response.json({ data: feed, message: '已刪除' }))
                        .catch(error => response.json({ status: 'error', data: error }));
                }
                else {
                    response.json({ status: 'error', data: '登入ID不一致' })
                }
            }
            else {
                response.json({ status: 'error', data: '無此篇文章' })
            }
        })
});

router.get('/:id', passport.authenticate('jwt', { session: false }), (request, response) => {
    const id = request.params.id;
    Feed.findById(id)
        .then(feed => response.json(feed))
        .catch(error => response.json({ status: 'error', data: error }));
});

router.get('/', (request, response) => {
    Feed.find({})
        .then(feeds => response.json(feeds))
        .catch(error => response.json({ status: 'error', data: error }));
})

module.exports = router;