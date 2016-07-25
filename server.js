'use strict';

let express = require('express'),
app = express(),
config = require('./config/config.js'),
mongoose = require('mongoose'),
Promise = require('bluebird'),
db,
server;

mongoose.Promise = Promise;

server = app.listen(config.port);
console.log('Server is listening on', config.port);
