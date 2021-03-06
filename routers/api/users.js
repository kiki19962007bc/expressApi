const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const secret = require('../../config/keys').secret;
const User = require('../../models/User');

const router = express.Router();

router.post('/register', (request, response) => {
    User.findOne({ email: request.body.email })
        .then(user => {
            if (user) {
                return response.json({ status: 'error', message: 'email已存在' });
            }
            else {
                const newUser = new User({
                    name: request.body.name,
                    age: request.body.age,
                    email: request.body.email,
                    password: request.body.password,
                });
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) {
                            throw error;
                        }
                        newUser.password = hash;
                        newUser.save()
                            .then(user => response.json(user))
                            .catch(error => response.json({ status: 'error', data: error }));
                    })
                })
            }
        })
})

router.post('/login', (request, response) => {
    const email = request.body.email;
    const password = request.body.password;
    User.findOne({ email: request.body.email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password)
                    .then(result => {
                        if (result) {
                            const rule = {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                            }
                            jwt.sign(rule, secret, { expiresIn: 38000 }, (error, token) => {
                                response.json({
                                    status: 'success',
                                    token: 'Bearer ' + token
                                })
                            })
                        }
                        else {
                            return response.json({ status: 'error', message: '密碼錯誤' });
                        }
                    })
            }
            else {
                return response.json({ status: 'error', message: '無此登入email' });
            }
        })
})

router.post('/edit/:id', passport.authenticate('jwt', { session: false }), (request, response) => {
    const id = request.params.id;
    const name = request.body.name;
    const age = request.body.age;
    User.findById(id)
        .then(user => {
            if (user) {
                if (id == request.user._id) {
                    user.name = request.body.name
                    user.age = request.body.age
                    user.save()
                        .then(user => response.json({ data: user, message: '已修改' }))
                        .catch(error => response.json({ status: 'error', data: error }));
                }
                else {
                    response.json({ status: 'error', data: '登入ID不一致' })
                }
            }
            else {
                response.json({ status: 'error', data: '無此ID' })
            }
        })
});

router.get('/delete/:id', passport.authenticate('jwt', { session: false }), (request, response) => {
    const id = request.params.id;
    User.findById(id)
        .then(user => {
            if (user) {
                if (id == request.user._id) {
                    User.findOneAndDelete({ _id: id },)
                        .then(user => response.json({ data: user, message: '已刪除' }))
                        .catch(error => response.json({ status: 'error', data: error }));
                }
                else {
                    response.json({ status: 'error', data: '登入ID不一致' })
                }
            }
            else {
                response.json({ status: 'error', data: '無此ID' })
            }
        })
});

router.get('/current', passport.authenticate('jwt', { session: false }), (request, response) => {
    response.json(request.user);
});

router.get('/:id', passport.authenticate('jwt', { session: false }), (request, response) => {
    const id = request.params.id;
    User.findById(id)
        .then(user => response.json(user))
        .catch(error => response.json({ status: 'error', data: error }));
});

router.get('/', (request, response) => {
    User.find({})
        .then(user => response.json(users))
        .catch(error => response.json({ status: 'error', data: error }));
});

module.exports = router;