const express = require('express');
const passport = require('passport');

const Response = require('../../models/Response');

const router = express.Router();

router.post('/add/:feedId', passport.authenticate('jwt', { session: false }), (request, response) => {
    const newResp = new Response({
        feedId: request.params.feedId,
        userId: request.user._id,
        content: request.body.content,
    });
    newResp.save()
        .then(resp => response.json(resp))
        .catch(error => response.json({ status: 'error', data: error }));
});

router.post('/edit/:id', passport.authenticate('jwt', { session: false }), (request, response) => {
    const id = request.params.id;
    const content = request.body.content;
    Response.findById(id)
        .then(resp => {
            if (resp) {
                if (resp.userId == request.user._id) {
                    resp.content = request.body.content
                    resp.save()
                        .then(resp => response.json({ data: resp, message: '已修改' }))
                        .catch(error => response.json({ status: 'error', data: error }));
                }
                else {
                    response.json({ status: 'error', data: '登入ID不一致' })
                }
            }
            else {
                response.json({ status: 'error', data: '無此篇留言' })
            }
        });
});

router.get('/delete/:id', passport.authenticate('jwt', { session: false }), (request, response) => {
    const id = request.params.id;
    Response.findById(id)
        .then(resp => {
            if (resp) {
                if (resp.userId == request.user._id) {
                    Response.findOneAndDelete({ _id: id },)
                        .then(resp => response.json({ data: resp, message: '已刪除' }))
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

router.get('/getbyid/:id', passport.authenticate('jwt', { session: false }), (request, response) => {
    const id = request.params.id;
    Response.find({ _id: id }, (error, resp) => {
        response.json(resp);
    });
});

router.get('/getbyfeed/:feedId', passport.authenticate('jwt', { session: false }), (request, response) => {
    const feedId = request.params.feedId;
    Response.find({ feedId: feedId }, (error, resp) => {
        response.json(resp);
    });
});

router.get('/getbyuser/:userId', passport.authenticate('jwt', { session: false }), (request, response) => {
    const userId = request.params.userId;
    Response.find({ userId: userId }, (error, resp) => {
        response.json(resp);
    });
});

module.exports = router;