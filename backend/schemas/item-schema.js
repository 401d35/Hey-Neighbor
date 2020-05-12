'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    _owner: {type: mongoose.Schema.Types.ObjectId, ref:'user'},
    item: {type: String, required: true},
    type: {type: String, required: true},
    documentation: {type: String, required: false},
    subCategory: {type: String, required: true},
    description: {type: String, required: true},
    review: {type: Number, required: false},
    image: {type: Image, required: false},
    _custodyId: {type: mongoose.Schema.Types.ObjectId, ref:'user'}
});

module.exports = mongoose.model('item', itemSchema);