'use strict';

const mongoose = require('mongoose'),
Schema = mongoose.Schema,
pollSchema = new Schema({
  _creator: {
    type: String,
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
      required: true,
      valdiate: {
        validator: v => !!v.length
      },
      message: 'Option cannot be empty'
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
