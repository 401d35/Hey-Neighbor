'use strict';

const express = require('express');
const userRoutes = express.Router();
const userSchema = require('../schemas/user-schema.js');
const itemSchema = require('../schemas/item-schema.js');
const Model = require('../schemas/model.js');

// return a list of all users in the database
userRoutes.get('/user', getAllUsers );
// return only the single user, no password
userRoutes.get('/user/:id', getUserById);
userRoutes.post('/user', createUser);
userRoutes.put('/user/:id', updateUser);
// this one needs discussion. Probably shouldn't 'delete' but inactivate
// then inactivate any items that are not loaned out
// anything still loaned out should stay so.
// on 'check-in' we can do a quick look to see if the owner is still active
// and if they are not, inactivate the item
userRoutes.delete('/user/:id', deactivateUser);
userRoutes.get('/user/active', getAllActiveUsers);

userRoutes.get('/test', async(req,res)=>{
  res.json({message: 'pass!'});
});


async function getAllActiveUsers(req, res){
  let userModel = new Model(userSchema);
  let userList = await userModel.getActive();
  userList.forEach( user => {
    delete user.password;
  });
  res.status(200).json(userList);
}

async function getAllUsers(req, res){
  let userModel = new Model(userSchema);
  let userList = await userModel.get();
  userList.forEach( user => {
    delete user.password;
  });
  res.status(200).json(userList);
}

async function getUserById(req,res){
  console.log(req.params.id);
  let userModel = new Model(userSchema);
  userModel.get(req.params.id)
    .then(dbUser => {
      res.status(200).json(dbUser[0]);
    })
    .catch(e => {
      res.status(400).json(e);
    });
}

async function createUser(req, res){
  let userModel = new Model(userSchema);
  try{
    let stored = await userModel.create(req.body);
    stored = stored.toObject(); // to delete parameters off of a return, must cast `toObject()` to use `delete`
    delete stored.password;
    res.status(201).json(stored);
  }catch (e){
    res.status(400).json(e);
  }
}

async function updateUser(req,res){
  let userModel = new Model(userSchema);
  let updateVals = req.body;
  console.log(typeof updateVals);
  delete updateVals.password; // prevents update of password. this needs a different route to handle something that dangerous
  let updatedUser = await userModel.update(req.params.id, updateVals);
  res.status(200).json(updatedUser);
}

async function deactivateUser(req,res){
  let userModel = new Model(userSchema);
  userModel.update(req.params.id, {'active':false,});
  let itemModel = new Model(itemSchema);
  itemModel.find({'_custodyId':req.params.id,'owner':req.params.id}).populate({path:'_owner', select:'_id'})
    .populate({path:'_custodyId', select:'_id',});
}

module.exports = userRoutes;
