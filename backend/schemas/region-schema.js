'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const regionSchema = new Schema({
    lat: {type: Number, required: true},
    lon: {type: Number, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    range: {type: Number, required: false}
});

module.exports = mongoose.model('region', regionSchema);