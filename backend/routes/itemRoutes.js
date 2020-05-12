'use strict';

const express = require('express');
const itemRoutes = express.Router();
const itemSchema = require ('../item-schema.js');
const Model = require('../schemas/model.js');

itemRoutes.get('/item/', getItem);
itemRoutes.get('/item/:id', getItemById);
itemRoutes.post('/item', createItem);
itemRoutes.put('/item/:id', updateItem);
itemRoutes.delete('/item/:itemid', deleteItem);

//get item with matching id
async function getItem(req,res) {
    let itemModel = Model(itemSchema);
    let itemList = await itemModel.get();
    res.status(200).json(itemList);
}

async function getItemById(req,res) {
    console.log(req.params.id);
    let itemModel = new Model(itemSchema);
    itemModel.get(req.params.id)
        .then(dbItem => {
            res.status(200).json(dbItem[0]);
        })
        .catch(e => {
            res.status(400).json(e);
        });
}

//creates a new item 
async function createItem(req,res) {
    let itemModel = new Model(itemSchema);
    let newItem = await itemModel.create(req.body);
    res.status(201).json(newItem);
}

//update item with the matching id
async function updateItem(req,res) {
    let itemModel = new Model(itemSchema);
    let updateContents = req.body;
    let updatedItem = await itemModel.update(req.params.id, updateContents);
    res.status(200).json(updatedItem);
}

//delete a item with the matching item id 
async function deleteItem(req,res) {
    let itemModel = new Model(itemSchema);
    itemModel.update(req.params.id, {'active':false});
}

module.exports = itemRoutes;