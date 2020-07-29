const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

router.post('/login',(request,response) => {
    const email = request.body.email;
    const password = request.body.password;
    User.findOne({ email: request.body.email })
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password)
            .then(result =>{
                if(result){
                    return response.json({ status: 'success', message: '登入成功' });
                }
                else{
                    return response.json({ status: 'error', message: '密碼錯誤' });
                }
            })
        }       
        else{
            return response.json({ status: 'error', message: '無此登入email' });
        }
    })
})


router.get('/', (request, response) => {
    User.find({}, (error, users) => {
        response.json(users);
    });
});

module.exports = router;