/* eslint-disable new-cap */
'use strict';

const express = require('express');
const rentalRoutes = express.Router();

const rentalSchema = require('../schemas/rental-schema.js');
const Model = require('../schemas/model.js');

rentalRoutes.get('/rentaldoc', getRentalDocs);
rentalRoutes.get('/rentaldoc/:_id',getRentalDocs);
rentalRoutes.post('/rentaldoc', createRentalDoc);
rentalRoutes.put('/rentaldoc/:_id', incrementRentalProcess);
rentalRoutes.delete('/rentaldoc/:_id', deactivateRentalDoc);



// create a rental doc
async function createRentalDoc(req,res){
  try{
    let rentalModel = new Model(rentalSchema);
    let newRental = await rentalModel.create(req.body);
    res.status(201).json(newRental);
  }catch(e){
    res.status(401).json(e);
  }
}

// update a rental doc. this ONLY changes the 'last update' field,
// advances the 'currentStatus' through the steps.
// this is accomplished via pre-save hook and is hands-free
async function incrementRentalProcess(req,res){
  try{
    let rentalModel = new Model(rentalSchema);
    let updatedRental = await rentalModel.resave(req.params._id);
    res.status(200).json(updatedRental);
  }catch(e){
    res.status(401).json(e);
  }

}

// return specific rental doc or all of them
async function getRentalDocs(req,res){
  let rentalModel = new Model(rentalSchema);
  try{
    const userList = await rentalModel.get(req.params._id);
    res.status(200).json(userList);
  }catch(e){
    res.status(401).json(e);
  }
}

// deactivate a rental doc
async function deactivateRentalDoc(req,res){
  let rentalModel = new Model(rentalSchema);
  let docCheck = await rentalModel.get(req.params._id);
  let invalidCancelStates = ['2','3'];
  if(invalidCancelStates.includes(docCheck[0].currentStatus.toString().charAt(0))){
    res.status(406).json(docCheck);
  }else{
    let docDeactivate = await rentalModel.update(req.params._id, {'archived':true,}, {new:true,});
    res.status(200).json(docDeactivate);
  }

}

module.exports = rentalRoutes;
