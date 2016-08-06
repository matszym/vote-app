'use strict';

const userCtrl = require('../controllers/user.server.controller.js');

module.exports = app => {
  app.route('/auth/user')
  .get(userCtrl.getUser);

  app.route('/auth/logout')
  .get(userCtrl.logOut);
}