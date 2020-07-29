const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 4000;

const keys = require('./config/keys')
const users = require('./routers/api/users');

mongoose.connect(keys.mongoUri, { useNewUrlParser: true })
    .then(() => {
        console.log('server connect db')
    })
    .catch((error) => {
        console.log(error)
    })

app.listen(port, () => {
    console.log("server is running on port " + port)
});

app.use('/api/users', users)

