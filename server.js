'use strict';


let express = require('express'),
app = express(),
morgan = require('morgan'),
bodyParser = require('body-parser'),
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

if (process.env.NODE_ENV === "development") {
  app.use(morgan('dev'));
}

app.use(session({
  secret: config.sessionSecret,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  resave: true,
  saveUninitialized: true

}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

require('./routes/poll.server.routes.js')(app);
require('./routes/index.server.routes.js')(app);
require('./routes/auth.server.routes.js')(app);
require('./routes/angular.server.routes.js')(app);

app.use(express.static('public'));

server = app.listen(config.port);
console.log('Server is listening on', config.port);
