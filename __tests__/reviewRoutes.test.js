'use strict';

const app = require('../backend/lib/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(app);
const faker = require('faker');
const itemSchema = require('../backend/schemas/item-schema.js');
const Model = require('../backend/schemas/model.js');

let reviewWriter = null;
let reviewSubject = null;
let testUser1 = null;
let testUser2 = null;
let item1 = null;
let itemModel = new Model(itemSchema);
let builtItem = null;
let aReview = null;

let token;

let creds = {
  'userName': 'test',
  'password': 'password',
  'address':'none',
  'email':'mail',
};

beforeAll(async () => {
  let resp = await mockRequest.post('/signup').send(creds);
  token = resp.text;
  console.log('my token', token);
});

// set('Authorization',`Bearer ${token}`).



describe('review routes', () => {

  beforeAll( async () => {
    testUser1 = {
      userName: faker.name.findName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      address: faker.address.streetAddress(),
    };
    testUser2 = {
      userName: faker.name.findName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      address: faker.address.streetAddress(),
    };

    reviewWriter = await mockRequest.post('/user').send(testUser1).set('Authorization',`Bearer ${token}`);
    reviewSubject = await mockRequest.post('/user').send(testUser2).set('Authorization',`Bearer ${token}`);

    item1 = {
      _owner: reviewSubject.body._id,
      owner:reviewSubject.body._id,
      item: 'mower',
      type: 'tool',
      documentation: '',
      subCategory: 'yard',
      description: 'Electric Mower',
      // review: {type: Number, required: false,},
      // image: {type: String, required: false,},
      // active: {type: Boolean, default: true, required: false,},
      _custodyId: reviewSubject.body._id,
    };
    builtItem = await itemModel.create(item1);
  });



  it('can create a user review', async () => {

    let review1 = {
      reviewSubject: reviewSubject.body._id,
      reviewWriter: reviewWriter.body._id,
      reviewType: 'user',
      score:faker.random.number({min:1, max:5,}),
      text: `I found ${testUser2.userName} to be a quality fellow and I would gladly borrow from them again.`,
    };

    let r1 = await mockRequest.post('/review').set('Authorization',`Bearer ${token}`).send(review1);
    expect(r1.status).toEqual(201);
    expect(typeof r1.body.text).toEqual('string');
  });

  it('can create an item review', async () => {
    let review1 = {
      reviewSubject: builtItem._id,
      reviewWriter: reviewWriter.body._id,
      reviewType: 'item',
      score:faker.random.number({min:1, max:5,}),
      text: `I think this ${builtItem.item} is sub-standard.`,
    };
    let review = await mockRequest.post('/review').set('Authorization',`Bearer ${token}`).send(review1);
    aReview = review;
    expect(review.body.reviewType).toEqual('item');
  });

  it('can get all reviews', async () => {
    let reviewPull = await mockRequest.get('/review').set('Authorization',`Bearer ${token}`);
    expect(reviewPull.body.length > 1).toEqual(true);
  });

  it('can get a review by it _id', async () => {
    let theAnswer = await mockRequest.get(`/review/${aReview.body._id}`).set('Authorization',`Bearer ${token}`);
    expect(theAnswer.body[0]._id).toEqual(aReview.body._id);
  });

  it('can get a review by the subject id', async () => {
    let itemReview = await mockRequest.get(`/review/${builtItem._id}/item`).set('Authorization',`Bearer ${token}`);
    let userReview = await mockRequest.get(`/review/${reviewSubject.body._id}/user`).set('Authorization',`Bearer ${token}`);
    expect(itemReview.body[0].reviewSubject.toString()).toEqual(builtItem._id.toString());
    expect(userReview.body[0].reviewSubject).toEqual(reviewSubject.body._id);
  });

});
