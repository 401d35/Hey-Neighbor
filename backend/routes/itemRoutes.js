const express = require('express');
const router = express.Router();
const ITEM = require ('../item-schema.js');

router.get('/item/:ITEMid', getITEM);
router.get('/item', getITEM);
router.post('/item', postITEM);
router.put('/item/:ITEMid', putITEM)
router.delete('/item/:ITEMid', deleteITEM);

//get item with matching id
function getITEM( req, res, next) {
    ITEM.get(req.params.ITEMid)
        .then(data => {
            res.status(200).json(data);
    })
        .catch(next);
}

//creates a new item 
function postITEM( req, res, next){
    ITEM.create(req.body)
        .then(data => {
            res.status(201).json(data);
        })
        .catch(next);
}

//update item with the matching id
function putITEM( req, res, next) {
    ITEM.update(req.params.ITEMid, req.body)
        .then(data => {
            res.status(201).json(data);
        })
        .catch(next);
}

//delete a item with the matching item id 
function deleteITEM( req, res) {
    ITEM.delete(req.params.ITEMid)
    .then(data => {
        res.status(202).json(data);
    });
}

module.exports = router