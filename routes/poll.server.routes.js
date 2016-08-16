'use strict';

const pollCtrl = require('../controllers/poll.server.controller.js'),
userCtrl = require('../controllers/user.server.controller.js');

module.exports = app => {
  
  app.route('/api/poll')
  .post(userCtrl.isAuthenticated, pollCtrl.createPoll);

  app.route('/api/polls')
  .get(pollCtrl.getPolls);

  app.route('/api/poll/:id')
  .get(pollCtrl.getPoll)
  .delete(userCtrl.isAuthenticated, pollCtrl.isAuthorized, pollCtrl.deletePoll)
  .put(pollCtrl.votePoll, pollCtrl.getPoll);
}
