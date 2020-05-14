/* eslint-disable new-cap */
'use strict';

const express = require('express');
const rentalRoutes = express.Router();

const rentalSchema = require('../schemas/rental-schema.js');
const Model = require('../schemas/model.js');
const basicAuth = require('../auth/basic-auth.js');


rentalRoutes.get('/rentaldoc', getRentalDocs);
rentalRoutes.get('/rentaldoc/:_id',getRentalDocs);
rentalRoutes.post('/rentaldoc', createRentalDoc);
rentalRoutes.put('/rentaldoc/:_id', updateRentalDoc);
rentalRoutes.delete('/rentaldoc/:_id', deactivateRentalDoc);



// create a rental doc
async function createRentalDoc(req,res){
  try{
    let rentalModel = new Model(rentalSchema);
    let newRental = await rentalModel.create(req.body);
    res.status(201).json(newRental);
  }catch(e){
    console.log(e);
  }
}


// return specific rental doc or all of them
async function getRentalDocs(req,res){

}


// update a rental doc
async function updateRentalDoc(req,res){

}

// deactivate a rental doc
async function deactivateRentalDoc(req,res){

}
