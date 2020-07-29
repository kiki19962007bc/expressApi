const express = require('express');
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
                newUser.save()
                    .then(user => response.json(user))
                    .catch(error => response.json({ status: 'error', data: error }));
            }
        })
})

router.get('/', (request, response) => {
    User.find({}, (error, users) => {
        response.json(users);
    });
});

module.exports = router;