const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const passport = require('passport');

const app = express();
const port = 4000;

const keys = require('./config/keys')
const users = require('./routers/api/users');
const feeds = require('./routers/api/feeds');
const responses = require('./routers/api/responses');

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./config/passport')(passport);

app.use('/api/users', users)
app.use('/api/feeds', feeds)
app.use('/api/responses/', responses)


