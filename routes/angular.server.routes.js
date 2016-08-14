'use strict';

/* 
  This routes exist only for friendly url's in angular app
*/

const angularEndpoints = [
  '/new-poll', 
  '/my-polls',
  '/poll/:id'
],
config = require('../config/config.js');

module.exports = app => {
  app.route(angularEndpoints)
  .get((req, res) => {
    res.render('index.ejs', config);
  });
}
