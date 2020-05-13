'use strict';

const express = require('express');
const itemRoutes = express.Router();

const itemSchema = require ('../schemas/item-schema.js');
const Model = require('../schemas/model.js');
const ITEM = new Model(itemSchema);

itemRoutes.get('/item/:ITEMid', getITEM);
itemRoutes.get('/item', getITEM);
itemRoutes.post('/item', postITEM);
itemRoutes.put('/item/:ITEMid', putITEM);
itemRoutes.delete('/item/:ITEMid', deleteITEM);

// get item or itemS
function getITEM( req, res) {
  ITEM.get(req.params.ITEMid)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(e => {
      res.status(401).json(e);
    });
}

//creates a new item 
function postITEM( req, res){
  ITEM.create(req.body)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(e => {
      res.status(401).json(e);
    });
}

//update item with the matching id
function putITEM( req, res) {
  ITEM.update(req.params.ITEMid, req.body)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(e => {
      res.status(401).json(e);
    });
}

//delete a item with the matching item id 
function deleteITEM( req, res) {
  ITEM.delete(req.params.ITEMid)
    .then(data => {
      res.status(202).json(data);
    });
}

module.exports = itemRoutes;
