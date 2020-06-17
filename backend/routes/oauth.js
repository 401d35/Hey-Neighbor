'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const authRoutes = express.Router();



authRoutes.get('/oauth', auth2);


// get item or itemS
function auth2( req, res) {
  console.log('lool',req.query);
}


module.exports = authRoutes;
