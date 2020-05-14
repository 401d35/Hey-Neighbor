'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const itemRoutes = express.Router();

const itemSchema = require ('../schemas/item-schema.js');
const Model = require('../schemas/model.js');
const ITEM = new Model(itemSchema);

itemRoutes.get('/item/:ITEMid', getITEM);
itemRoutes.get('/item', getITEM);
itemRoutes.post('/item', postITEM);
itemRoutes.put('/item/:ITEMid', putITEM);
itemRoutes.delete('/item/:ITEMid', deactivateITEM);

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

//deactivate an item a item with the matching item id
async function deactivateITEM( req, res) {
  try{
    let result = await ITEM.deactivateItem(req.params.ITEMid);
    res.status(200).json(result);
  }catch(e){
    res.status(400).send(e);
  }
}

module.exports = itemRoutes;
