'use strict';

const mongoose = require('mongoose'),
Schema = mongoose.Schema,
pollSchema = new Schema({
  _creator: {
    type: Number,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  votes: [{
    option: {
      type: String,
      valdiate: {
        validator: v => this.options.indexOf(v) !== -1;
      },
      message: 'Option doesn\'t exist'
    },
    voterIP: {
      type: String
    }
  }]
});

pollSchema.pre('save', next => {
  this.created = new Date();
  next();
})

module.exports = mongoose.model('Poll', pollSchema);
