'use strict';

const ejs = require('ejs');

module.exports = app => {
  app.set('view engine', 'ejs');

  app.get('/', (req, res) => res.render('index.ejs'));
}