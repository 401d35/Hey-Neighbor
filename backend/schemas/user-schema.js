/* eslint-disable new-cap */
'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userName: {type: String, required: true,},
  password: {type: String, select: false, required: true,},
  email: {type: String, required: true,},
  address: {type: String, required: true,},
  region: {type: String, required: false,},
  active: {type: Boolean, default: true, required:false,},
  avatar: {type:String, required:false,},
});

module.exports = mongoose.model('user', userSchema);
