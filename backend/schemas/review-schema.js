'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// subject can be any _id
// review writer is intended to be 'user' _id
// reviewType is to denote if a review of a 'user' or an 'item'
// this can be used during querying to find the needed records
// it's unlikely, but possible, that the same _id could be on two collections
// so we can search more accurately if we know the review type

const reviewSchema = new Schema({
  reviewSubject: {type:String, required:true,},
  reviewWriter: {type: String, required:true,},
  reviewType: {type: String, required: true,},
  score:{ type: Number, required: true,},
  date: {type: Date, required:true,},
  text: {type:String, required:true,},
});

mongoose.model('review', reviewSchema);
