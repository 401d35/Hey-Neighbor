/* eslint-disable new-cap */
'use strict';

const express = require('express');
const userRoutes = express.Router();
const superagent = require('superagent');
const Model = require('../schemas/model.js');
const basicAuth = require('../auth/basic-auth.js')
const userSchema = require('../schemas/user-schema.js');
const oauth = require('../auth/google-oauth/google-oauth.js');

userRoutes.post('/oauth', (req, res) => {
  let token = req.body.id_token;
  let secondTokenEndpoint = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`;
  superagent.get(secondTokenEndpoint)
    .then(verifiedToken => {
      // Do mongo stuff to store this data
      res.status(200).end() // .send(verifiedToken.body);
    });
});

userRoutes.get('/user', async function (req, res) {
  let userList = USER.find({});
  res.status(200).json(userList);
});

userRoutes.get('/user/:userName', async function (req, res) {
  let dbUser = USER.find({
    'userName': req.body.userName,
  });
  if (dbUser.length > 0) {
    delete dbUser[0].password;
    res.status(200).json(dbUser[0]);
  }
});


userRoutes.post('/signup', handleSignup); // sign up route
userRoutes.post('/signin', basicAuth, handleSignin); // sign in route
// return a list of all users in the database
userRoutes.get('/user', getAllUsers);
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
  res.json({message: 'pass!',});
});

function handleSignin(req, res) {
  res.status(200).send(req.token);
}


function handleSignup(req, res) {
  users.signup(req.body)
    .then(created => {
      // delete password property
      delete created.password;
      res.status(201).json(created);
    })
    .catch(error => {
      res.status(400).send(error);
    });
}


async function getAllActiveUsers(req, res){
  let userModel = new Model(userSchema);
  let userList = await userModel.getActive();
  userList.forEach( user => {
    delete user.password;
  });
  res.status(200).json(userList);
}


async function getAllUsers(req, res) {
  const userList = await users.get();

  userList.forEach( user => {
    delete user.password;
  });
  res.status(200).json(userList);
}

async function getUserById(req, res) {
  users.get(req.params.id)
    .then(dbUser => {
      res.status(200).json(dbUser[0]);
    })
    .catch(() => {
      res.status(400).json('No matching user found');
    });
}

async function createUser(req, res){
  try{
    let stored = await users.create(req.body);
    stored = stored.toObject(); // to delete parameters off of a return, must cast `toObject()` to use `delete`
    delete stored.password;
    res.status(201).json(stored);
  }catch(e){
    res.status(401).json(e);
  }
}

async function updateUser(req, res) {
  // req.body will never contain password property
  const updatedUser = await users.update(req.params.id, req.body);
  res.status(200).json(updatedUser);
}

async function deactivateUser(req, res) {
  users.update(req.params.id, {'active':false,});
  let itemModel = new Model(itemSchema);
  itemModel.find({'_custodyId':req.params.id,'owner':req.params.id,}).populate({path:'_owner', select:'_id',})
    .populate({path:'_custodyId', select:'_id',});
  // send some message back
  res.send('Your account is successfully deactivated!');
}

module.exports = userRoutes;