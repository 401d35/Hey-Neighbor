'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    item: {type: String, required: true},
    type: {type: String, required: true},
    documentation: {type: String, required: true},
    subCategory: {type: String, required: true}
});

module.exports = mongoose.model('user', itemSchema);