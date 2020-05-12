'use strict';

const express = require('express');
const userRoutes = express.Router();
const userSchema = require('../schemas/user-schema.js');
const itemSchema = require('../schemas/item-schema.js');
const Model = require('../schemas/model.js');

userRoutes.get('/user', async function(req, res){
  let userModel = new Model(userSchema);
  let userList = await userModel.get();
  res.status(200).json(userList);
});

userRoutes.get('/user/:id', async function (req,res) {
  let userModel = new Model(userSchema);
  userModel.get(req.params.id)
    .then(dbUser => {
      delete dbUser.password;
      res.status(200).jsoon(dbUser);
    })
    .catch(e => {
      res.status(400).json(e);
    });
});

userRoutes.post('/user', async function (req,res){
  let userModel = new Model(userSchema);
  let stored = await userModel.create(req.body);
  res.status(201).json(stored);
});

userRoutes.put('/user/:id', async function(req,res){
  let userModel = new Modle(userSchema);

  let updateVals = req.body;
  delete updateVals.password;

  let updatedUser = await userModel.update(id, updateVals);

  res.status(200).json(updatedUser);


});


// this one needs discussion. Probably shouldn't 'delete' but inactivate
// then inactivate any items that are not loaned out
// anything still loaned out should stay so.
// on 'check-in' we can do a quick look to see if the owner is still active
// and if they are not, inactivate the item
userRoutes.delete('/user/:id', async function(req,res){
  let userModel = new Model(userSchema);
  userModel.update(req.params.id, {'active':false,});
  let itemModel = new Model(itemSchema);
  
});
