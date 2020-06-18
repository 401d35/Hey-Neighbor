'use strict';

const User = require('../schemas/user-model.js');

module.exports = (req, res, next) => {
  if(!req.headers.authorization) {
    next('invalid login');
  } else {
    // req.headers.authorization = 'Bearer 09sf09jf09jf0stoken'
    const token = req.headers.authorization.split(' ').pop();
    User.authenticateToken(token)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => next(err));

  }
};
