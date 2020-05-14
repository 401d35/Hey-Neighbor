/* eslint-disable new-cap */
'use strict';

const app = require('../backend/lib/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(app);
const faker = require('faker');
const mongoose = require('mongoose');

let testUser1 = null;
let testUser2 = null;
let itemOwner = null;
let itemBorrower = null;
let firstItemId = null;
let item1 = null;
let item2 = null;
let itemFull2 = null;


describe('item route affirmitive tests', () => {

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

    itemOwner = await mockRequest.post('/user').send(testUser1);
    itemBorrower = await mockRequest.post('/user').send(testUser2);

    item1 = {
      _owner: itemOwner.body._id,
      item: faker.commerce.productName(),
      type: faker.commerce.productAdjective(),
      subCategory: faker.commerce.productMaterial(),
      description: `This is a ${faker.company.bsBuzz()} ${faker.company.bsAdjective()} ${faker.company.bsNoun()}.`,
    };

    item2 = {
      _owner: itemOwner.body._id,
      item: faker.commerce.productName(),
      type: faker.commerce.productAdjective(),
      subCategory: faker.commerce.productMaterial(),
      description: `This is a ${faker.company.bsBuzz()} ${faker.company.bsAdjective()} ${faker.company.bsNoun()}.`,
    };
  });

  it('can create an item "post /item"', async() =>{
    let builtItem = await mockRequest.post('/item').send(item1);
    firstItemId = builtItem.body._id;
    expect(builtItem.body._id).toBeTruthy();
    expect(builtItem.status).toEqual(201);
  });

  it('can get items from the db "get /item"', async () => {
    itemFull2 = await mockRequest.post('/item').send(item2);
    let returns = await mockRequest.get('/item');
    expect(returns.status).toEqual(200);
    expect(returns.body.length > 1).toEqual(true);
  });

  it('can get one item by id "get /item/_id"', async () => {
    let oneItem = await mockRequest.get(`/item/${firstItemId}`);
    expect(oneItem.body.length).toEqual(1);
    expect(oneItem.body[0].item).toEqual(item1.item);
  });

  it('can update 1 item by id "put /item/_id"', async () => {
    let description = 'I am updated!';
    let update = {
      description: description,
    };

    let updatedItem = await mockRequest.put(`/item/${firstItemId}`).send(update);
    expect(updatedItem.body.description).not.toEqual(item1.description);
    expect(updatedItem.body.description).toEqual(description);
  });

  it('can deactiave an item "delete /item/_id', async () => {
    let deactive = await mockRequest.delete(`/item/${firstItemId}`);
    expect(deactive.body.active).toEqual(false);
    expect(deactive.body._id).toEqual(firstItemId);
  });

  it('will error if item is checked out "delete /item/_id"', async () => {
    let update = {
      _custodyId: mongoose.Types.ObjectId(itemBorrower.body._id.toString()),
    };
    await mockRequest.put(`/item/${itemFull2.body._id}`).send(update);
    let deactive = await mockRequest.delete(`/item/${itemFull2.body._id}`);
    expect(deactive.text).toEqual('Error: Item is checked out. Can not deactivate at this time.');
  });
});
