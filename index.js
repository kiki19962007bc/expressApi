const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { response } = require('express');
const port = 4000;
const keys = require('./config/keys').mongoUri

mongoose.connect(keys.mongoUri, { useNewUrlParser: true })
    .then(() => {
        console('server connect db')
    })
    .catch((error) => {
        console.log(error)
    })

app.listen(port, () => {
    console.log("server is running on port " + port)
});
app.get('/', (request, response) => {
    response.send('server test')
})

