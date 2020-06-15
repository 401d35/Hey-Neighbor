'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const authRoutes = express.Router();

const bearerAuth = require('../auth/bearer-auth.js');


authRoutes.get('/item/:ITEMid',bearerAuth, getITEM);



// get item or itemS
function getITEM( req, res) {
  res.status(200).send(req.token);
}


module.exports = authRoutes;
