const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const Promise = require('bluebird');
const logger = require('morgan');

const app = express();

const config = require('./config/config');

app.use(cors());
//app.use(logger('dev'));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

// MongoDB configs
mongoose.Promise = Promise;
mongoose.connect(config.MONGO_URI);

const routes = require('./routes');
app.use(routes);

app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError')
        return res.status(401).json({"message" : err.name + ": " + err.message});
});

app.get('/', function(req, res) { res.send('hello world') });

module.exports = app;
