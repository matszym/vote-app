'use strict';


let express = require('express'),
app = express(),
session = require('express-session'),
MongoStore = require('connect-mongo')(session),
config = require('./config/config.js'),
passport = require('passport'),
mongoose = require('mongoose'),
Promise = require('bluebird'),
db,
server;

require('./config/passport.js')();
let userCtrl = require('./controllers/user.server.controller.js');

Promise.promisifyAll(mongoose);
db = mongoose.connect(config.mongo);

app.use(session({
  secret: config.sessionSecret,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  resave: false,
  saveUninitialized: true

}));
app.use(passport.initialize());
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

require('./routes/poll.server.routes.js')(app);
require('./routes/index.server.routes.js')(app);

server = app.listen(config.port);
console.log('Server is listening on', config.port);
