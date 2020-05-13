'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  _owner: {type: mongoose.Schema.Types.ObjectId, ref:'user',},
  item: {type: String, required: true,},
  type: {type: String, required: true,},
  documentation: {type: String, required: false,},
  subCategory: {type: String, required: true,},
  description: {type: String, required: true,},
  review: {type: Number, required: false,},
  image: {type: String, required: false,},
  active: {type: Boolean, default: true, required: false,},
  _custodyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
    default: function() {
      if(this._owner){
        return this._owner;
      }return null;
    },
  },
});

module.exports = mongoose.model('item', itemSchema);
