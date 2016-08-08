'use strict';

const Poll = require('../models/poll.server.model.js'),
msg = require('./message.server.controller.js');

exports.createPoll = (req, res) => {
  console.log(req.user);

  req.body._creator = req.user._id;

  Poll.createAsync(req.body)
  .then(poll => {
    res
    .send(poll);
  })
  .catch(err => {
    res
    .status(400)
    .send(err);
  });
}

exports.getPoll = (req, res) => {
  Poll.findOneByIdAsync(req.params.id)
  .then(poll => res.send(poll))
  .catch(err => {
    res
    .status(400)
    .send(err);
  })
}

exports.getPolls = (req, res) => {
  Poll.find({})
  .sort('-created')
  .limit(req.params.limit)
  .skip(req.params.offset)
  .execAsync()
  .then(polls => res.send(polls))
  .catch(err => {
    res
    .status(400)
    .send(msg('We experienced technical dificulties feetching pools. Please try again later', 'danger'))
  })
}

exports.getAllResults = (req, res) => {
  Poll.findAsync({_creator: req.user})
  .sort('-created')
  .limit(req.params.limit)
  .offset(req.params.offset)
  .then(results => res.send(polls))
  .catch(err => {
    res
    .status(400)
    .send(msg('We could not feetch your polls results. Please try again later', 'danger'));
  })
}

exports.deletePoll = (req, res) => {
  Poll.removeAsync({_id: req.params.id})
  .then(poll => res.send(msg(`Poll ${poll.name} removed.`)))
  .catch(err => {
    res
    .status(400)
    .send('We could not remove poll. Please try again later.');
  });
}
