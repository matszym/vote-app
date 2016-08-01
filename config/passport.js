'use strict';

let passport = require('passport'),
mongoose = require('mongoose');

module.exports = () => {
  let User = require('../models/user.server.model.js');

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findOneAsync({
      _id: id
    })
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    })
  })

  require('./strategies/twitter.js');
}