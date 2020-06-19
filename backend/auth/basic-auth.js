'use strict';

// 3rd party dependencies
const base64 = require('base-64');
const users = require('../schemas/user-model.js');

module.exports = (req, res, next) => {
  // check if the header contains headers
  if(!req.headers.authorization) {
    next('invalid login details!');
  } else {
    // decode the headers and extract username and password
    const basic = req.headers.authorization.split(' ')[1];	
    const [userName, password] = base64.decode(basic).split(':');
    // authenticate the credentials
    console.log('user stuff', userName, password);
    users.authenticateBasic(userName, password)
      .then(validUser => {
        // generate token and send it to user
        const token = users.generateToken(validUser);
        req.token = token;
        next();
      })
      .catch(error => next(error));
  }
};
