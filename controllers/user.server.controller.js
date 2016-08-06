'use strict';

let Promise = require('bluebird'),
passport = require('passport');

exports.signin = (req, res, next) => {
  let authenticate = Promise.promisify(passport.authenticate('twitter'));
  console.log('inside controller');
  authenticate(req, res, next)
  .then((user, info) => {
    if(!user) {
      return res
        .status(401)
        .send({
          message: 'Authentication failed'
        });
    } else {
      let logIn = Promise.promisify(req.logIn);

      logIn(user)
      .then(() => res.send({
        message: 'You are now logged in',
        user
      }))
      .catch(next);
    }
  })
  .catch(next);
}

exports.isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res
    .status(401)
    .send([{
      content: 'Please log in first',
      type: 'danger'
    }])
  } else {
    next();
  }
}

exports.getUser = (req, res) => {
  res.send(req.user || {});
}

exports.logOut = (req, res) => {
  req.logOut();
  res.send([{
    content: 'User has been logged out',
    type: 'success'
  }]);
}