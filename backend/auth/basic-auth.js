'use strict';

// 3rd party dependencies
const base64 = require('base-64');
const users = require('../schemas/user-model.js');

module.exports = (req, res, next) => {
  // check if the header contains headers

    // decode the headers and extract username and password
    
    // authenticate the credentials
    users.authenticateBasic(userName, password)
      .then(validUser => {
        // generate token and send it to user
        const token = users.generateToken(validUser);
        req.token = token;
        next();
      })
      .catch(error => next(error));
  
};
