'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    address: {type: String, required: true},
    userId: {type: Number, required: true},
    //region: {}
});

module.exports = mongoose.model('user', userSchema);