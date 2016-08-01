'use strict';

let passport = require('passport'),
config = require('../config.js'),
User = require('../../models/user.server.model.js'),
mongoose = require('mongoose'),
TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
  consumerKey: config.twitter.consumerKey,
  consumerSecret: config.twitter.consumerSecret,
  callbackURL: config.twitter.callbackURL
},
function(token, tokenSecret, profile, cb) {

  User.findOneAndUpdateAsync({
    twitterId: profile.id
  },
  {
    twitterId: profile.id,
    twitterImg: profile.photos[0].value,
    name: profile.displayName
  },
  {
    upsert: true
  })
  .then(user => {
    cb(null, user);

    return null;
    /* 
      return null because bluebird is throwing warning,
      that promise was created in handler, but was not returned from it
      I'm not creatig promise here. It has to be created inside cb function -
      looks like false warning report
    */
  })
  .catch(cb);
}));