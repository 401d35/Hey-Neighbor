'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {type: String, required: true,},
  password: {type: String, required: true,},
  email: {type: String, required: true,},
  address: {type: String, required: true,},
  region: {type: String, required: false,},
  active: {type: Boolean, default: true, required:false,},
});

module.exports = mongoose.model('user', userSchema);
