'use strict';

let mongoose = require('mongoose'),
Schema = mongoose.Schema,
UserSchema;

UserSchema = new Schema({
  name: String,
  twitterId: Number,
  twitterImg: String
})

module.exports = mongoose.model('User', UserSchema);
