'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const reviewRoutes = express.Router();
const reviewSchema = require('../schemas/review-schema.js');
const Model = require('../schemas/model.js');
const bearerAuth = require('../auth/bearer-auth.js');

// get all reviews and return to user
reviewRoutes.get('/review', bearerAuth, async (req, res) => {
  let reviewModel = new Model(reviewSchema);
  let results = await reviewModel.get();
  res.status(200).json(results);
});

reviewRoutes.get('/userReviews/:id', bearerAuth, async (req, res) => {
  let reviewModel = new Model(reviewSchema);
  try {
    let results = await reviewModel.getReviewByUser(req.params.id, 'user');
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json(e);
  }
});

reviewRoutes.get('/itemReviews/:id', bearerAuth, async (req, res) => {
  let reviewModel = new Model(reviewSchema);
  try {
    let results = await reviewModel.getReviewByUser(req.params.id, 'item');
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json(e);
  }
});


reviewRoutes.get('/review/:id', bearerAuth, async (req, res) => {
  let reviewModel = new Model(reviewSchema);
  let results = await reviewModel.get(req.params.id);
  res.status(200).json(results);
});

// this will find the review based on the subject and type of review
// rather than by finding by the review ID
reviewRoutes.get('/review/:subject_id/:type', bearerAuth, async (req, res) => {
  // let reviewModel = new Model(reviewSchema);
  let query = { $and: [{ reviewSubject: req.params.subject_id, reviewType: req.params.type, }], };
  let results = await reviewSchema.find(query);
  res.status(200).json(results);
});

reviewRoutes.post('/review', bearerAuth, async (req, res) => {
  let reviewModel = new Model(reviewSchema);
  try {
    let stored = await reviewModel.create(req.body);
    res.status(201).json(stored);
  } catch (e) {
    res.status(400).json(e);
  }
});

reviewRoutes.put('/review/:id', bearerAuth, async (req, res) => {
  let reviewModel = new Model(reviewSchema);
  reviewModel.update(req.body)
    .then(results => {
      res.status(201).json(results);
    })
    .catch(e => {
      res.status(400).json(e);
    });
});

reviewRoutes.delete('/review/:id', bearerAuth, async (req, res) => {
  let reviewModel = new Model(reviewSchema);
  reviewModel.delete(req.params.id)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(e => {
      res.status(401).json(e);
    });
});



module.exports = reviewRoutes;
