'use strict';

const pollCtrl = require('../controllers/poll.server.controller.js'),
userCtrl = require('../controllers/user.server.controller.js');

module.exports = (app, io) => {
  
  app.route('/api/poll')
  .post(userCtrl.isAuthenticated, pollCtrl.createPoll);

  app.route('/api/polls')
  .get(pollCtrl.getPolls);

  app.route('/api/poll/:id')
  .get(pollCtrl.getPoll(io))
  .delete(userCtrl.isAuthenticated, pollCtrl.isAuthorized, pollCtrl.deletePoll)
  .put(pollCtrl.votePoll(io), pollCtrl.getPoll(io));
}
