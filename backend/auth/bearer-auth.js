'use strict';

const users = require('../schemas/user-model.js');

module.exports = (req, res, next) => {

  if(!req.headers.authorization) {
    next('invalid login');
  } else {
    // req.headers.authorization = 'Bearer 09sf09jf09jf0stoken'
    const token = req.headers.authorization.split(' ').pop();
    users.authenticateToken(token)
      .then(validUser => {
        req.user = validUser;
        next();
      })
      .catch(err => next(err));

  }
};
