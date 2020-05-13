'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const regionSchema = new Schema({
    lat: {type: Number, required: true},
    lon: {type: Number, required: true},
    address: {type: String, required: true},
    name: {type: String, required},
    range: {type: Number, required}
});

module.exports = mongoose.model('region', regionSchema);