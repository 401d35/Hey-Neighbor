'use strict';

const express = require('express');
const SECRET = process.env.SECRET;
const userRoutes = express.Router();
const USER = require('../schemas/user-schema.js');
const bcrypt = require('bcryptjs');

userRoutes.get('/oauth', oauth, (req, res) => {
  res.status(200).send(req.token);
});

userRoutes.get('/user', async function(req, res){
  let userList = USER.find({});
  res.status(200).json(userList);
});

userRoutes.get('/user/:userName', async function (req,res) {
  let dbUser = USER.find({'userName':req.body.userName,});
  if(dbUser.length > 0){
    delete dbUser[0].password;
    res.status(200).json(dbUser[0]);
  }
});

userRoutes.post('/user', async function (req,res){

  let user = new USER(req.body);
  let stored = await user.save();
  res.status(201).json(stored);
});

userRoutes.put('/user', async function(req,res){
  let userName = req.body.userName;
  let dbUser = USER.find({'userName':userName,});
  let updateFields = {};

  if(bcrypt.compare(req.body.password, dbUser.password)){
    Object.keys(req.body).forEach( field => {
      updateFields[field] = req.body.field;
    });
    delete updateFields.userName;
    delete updateFields.password;
    let options = {'new': true,};
    let updatedUser = await USER.findByIdAndUpdate(dbUser._id, updateFields, options);
    res.status(201).json(updatedUser);
  }


});


// this one needs discussion. Probably shouldn't 'delete' but inactivate
// then inactivate any items that are not loaned out
// anything still loaned out should stay so.
// on 'check-in' we can do a quick look to see if the owner is still active
// and if they are not, inactivate the item
userRoutes.delete('/user/:userName', async function(req,res){

});
