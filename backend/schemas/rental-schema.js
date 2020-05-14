'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
  _owner:{type: mongoose.Schema.Types.ObjectId, ref:'user',required:true,},
  _borrower: {type: mongoose.Schema.Types.ObjectId, ref:'user',required:true,},
  _item: {type: mongoose.Schema.Types.ObjectId, ref:'item',required:true,},
  initiatedDate: {type: Date, default: null,},
  lastUpdate: {type: Date, },
  currentStatus: {type:String, default:null,},
  openRental:{type:Boolean, default:true,},
  archived:{type: Boolean, default:false,},
});

// currentStatus is a progressivly updating field
// 1-borrowRequest -> intended borrower asks for the item
// 2-borrowApproved -> owner agrees to lend out the item
// 3-returnOffer -> borrower presents the item back to the original owner
// 4-returnAck -> owner has received the item in to their posession
// each stage will not to be processed in sequence via

rentalSchema.pre('save', function(){
  this.lastUpdate = new Date(Date.now());

  if(this.initiatedDate === null){
    this.initiatedDate = new Date(Date.now());
  }

  switch(this.currentStatus){
  case null:
    this.currentStatus = '1-borrowRequest';
    break;
  case '1-borrowRequest':
    this.currentStatus = '2-borrowApproved';
    break;
  case '2-borrowApproved':
    this.currentStatus = '3-returnOffer';
    break;
  case '3-returnOffer':
    this.currentStatus = '4-returnAck';
    break;
  case '4-returnAck':
    this.openRental = false;
    break;
  default:
    break;
  }

});




module.exports = mongoose.model('rentaldoc', rentalSchema);
