const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/users', require('./api/users'));
app.use('/media', require('./api/media'));

module.exports = app;