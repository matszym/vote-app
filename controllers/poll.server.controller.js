'use strict';

const _ = require('underscore'),
ip = require('request-ip'),
Poll = require('../models/poll.server.model.js'),
msg = require('./message.server.controller.js');

exports.createPoll = (req, res) => {
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

exports.transformPoll = poll => {
  let votesBlueprint = poll.options.map(x => 0); // initialize votes array eg. [0, 0, 0, 0]
  
  let options = poll.votes, 
  reducedVotes = poll.votes.reduce((votes, o) => {
    let i = poll.options.indexOf(o.option);
  
    if (i >= 0) { // options contains the vote
      votes[i] += 1;
    } else { // its new vote, add the option to options
      poll.options.push(o.option);
      votes.push(1);
    }

    return votes;
  }, votesBlueprint);

  poll.votes = reducedVotes;

  return {
    title: poll.title,
    options: poll.options,
    votes: reducedVotes,
    owner: poll._creator
  }
}

exports.getPoll = io => {
  return (req, res) => {
    Poll.findById(req.params.id)
    .execAsync()
    .then(poll => {
      io.of(`/${req.params.id}`);
      res.send(exports.transformPoll(poll));
    })
    .catch(err => {
      res
      .status(400)
      .send(err);
    })
  }
}

exports.getPolls = (req, res) => {
  function parse(str) {
    let parsed = parseInt(str, 10);

    return parsed.toString() === str ? parsed : 0;
  }

  const query = {};
  let response = {};

  if (req.query.user) {
    query._creator = req.query.user;
  }

  Poll.find(query)
  .sort('-createdAt')
  .limit(parse(req.query.limit))
  .skip(parse(req.query.offset))
  .execAsync()
  .then(polls => {
    response.polls = polls;

    return Poll.find({})
    .count()
    .execAsync();
  })
  .then(count => {
    _.extend(response, {
      query: {
        count,
        offset: parse(req.query.offset),
        limit: parse(req.query.limit),
        time: parse(req.query.time)
      }
    });

    res.send(response);
  })
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

exports.isAuthorized = (req, res, next) => {
  Poll.findByIdAsync({_id: req.params.id})
  .then(poll => {
    if (poll._creator.toString() === req.user._id.toString()) {
      next();
    } else {
      res
      .status(401)
      .send('You are not authorized to remove this poll');
    }
  })
  .catch(err => {
    res
    .status(400)
    .send('Poll not found');
  });
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

exports.votePoll = io => {
  return (req, res, next) => {
    Poll.findByIdAsync({_id: req.params.id})
    .then(() => {
      return Poll.updateAsync(
        {
          _id: req.params.id
        }, 
        {
          $push: {
            "votes": {
              option: req.body.vote,
              voterIP: ip.getClientIp(req)
            }
          }
        });
    })
    .then(numAffected => 
      Poll.findByIdAsync({_id: req.params.id}
    ))
    .then(doc => {
      io.of(`/${req.params.id}`)
      .emit('chartUpdate', exports.transformPoll(doc));

      next();
    })
    .catch(err => {
      throw err;
    });
  }
}

exports.ensureSingleVote = (req, res, next) => {
  if (!req.body.vote || !req.body.vote.length) {
    return res.status(400).send(msg('Vote not recognized', 'danger'));
  }

  Poll.findByIdAsync({_id: req.params.id})
  .then((poll) => {
    if (poll.votes.some(x => x.voterIP === ip.getClientIp(req))) {
      res.status(400).send(msg('You have already voted in this poll', 'danger'))
    } else {
      next();
    }
  })
  .catch(err => {
    throw err;
  })
}
