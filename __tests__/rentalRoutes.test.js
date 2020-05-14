/* eslint-disable new-cap */
'use strict';

const app = require('../backend/lib/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(app);
const faker = require('faker');
const mongoose = require('mongoose');

let rental1data = null;
let rental2data = null;
let rental3data = null;
let owner = null;
let borrower = null;
let item1data = null;
let item2data = null;
let ownerData = null;
let borrowerData = null;
let item1 = null;
let item2 = null;
let rental1 = null;
let rental2 = null;
let rental3 = null;

describe('rental routes', () => {

  beforeAll( async () => {

    ownerData = {
      userName: faker.name.findName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      address: faker.address.streetAddress(),
    };

    borrowerData = {
      userName: faker.name.findName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      address: faker.address.streetAddress(),
    };

    owner = await mockRequest.post('/user').send(ownerData);
    borrower = await mockRequest.post('/user').send(ownerData);

    item1data = {
      _owner: owner.body._id,
      item: faker.commerce.productName(),
      type: faker.commerce.productAdjective(),
      subCategory: faker.commerce.productMaterial(),
      description: `This is a ${faker.company.bsBuzz()} ${faker.company.bsAdjective()} ${faker.company.bsNoun()}.`,
    };

    item2data = {
      _owner: owner.body._id,
      item: faker.commerce.productName(),
      type: faker.commerce.productAdjective(),
      subCategory: faker.commerce.productMaterial(),
      description: `This is a ${faker.company.bsBuzz()} ${faker.company.bsAdjective()} ${faker.company.bsNoun()}.`,
    };

    let item1 = await mockRequest.post('/item').send(item1data);
    let item2 = await mockRequest.post('/item').send(item2data);

    rental1data = {
      _owner: mongoose.Types.ObjectId(owner.body._id),
      _borrower: mongoose.Types.ObjectId(borrower.body._id),
      _item: mongoose.Types.ObjectId(item1.body._id),
    };

    rental2data = {
      _owner: mongoose.Types.ObjectId(owner.body._id),
      _borrower: mongoose.Types.ObjectId(borrower.body._id),
      _item: mongoose.Types.ObjectId(item2.body._id),
    };

    rental3data = {
      _owner: mongoose.Types.ObjectId(owner.body._id),
      _borrower: mongoose.Types.ObjectId(borrower.body._id),
      _item: mongoose.Types.ObjectId(item2.body._id),
    };

  });


  it('can create new rental requests', async() => {
    // const realDateNow = Date.now.bind(global.Date);
    const dateNowStub1 = jest.fn(() => 1589331600000); //Wednesday, May 13, 2020 1:00:00 AM
    global.Date.now = dateNowStub1;

    rental1 = await mockRequest.post('/rentaldoc').send(rental1data);
    // console.log('***', rental1.body);
    expect(rental1.body.currentStatus).toEqual('1-borrowRequest');
    expect(typeof rental1.body._owner).toEqual('string');
    expect(typeof rental1.body._borrower).toEqual('string');
    expect(typeof rental1.body._item).toEqual('string');
    expect(rental1.body.initiatedDate).toEqual('2020-05-13T01:00:00.000Z');
    expect(rental1.body.lastUpdate).toEqual('2020-05-13T01:00:00.000Z');
  });

  it('can update a rental request incrementaly', async() => {
    const dateNowStub2 = jest.fn(() => 1589335200000); //2020-05-13T02:00:00.000Z
    global.Date.now = dateNowStub2;
    // console.log('MY ID', rental1.body._id);
    let updatedRental = await mockRequest.put(`/rentaldoc/${rental1.body._id}`);
    // console.log('***rentalFinal', updatedRental.body);
    expect(updatedRental.body.lastUpdate).toEqual('2020-05-13T02:00:00.000Z');
    expect(updatedRental.body.initiatedDate).toEqual('2020-05-13T01:00:00.000Z');

  });

  it('will get back all rental docs in the system', async () =>{
    rental2 = await mockRequest.post('/rentaldoc').send(rental2data);
    let rentalList = await mockRequest.get('/rentaldoc');
    // console.log('rentalList', rentalList.body);
    expect(rentalList.body.length).toEqual(2);
  });

  it('will get back just the 1 desired rental doc', async () => {
    let rental2copy = await mockRequest.get(`/rentaldoc/${rental2.body._id}`);
    // console.log('rental2copy',rental2copy.body );
    expect(rental2copy.body.length).toEqual(1);
  });

  it('will only deactivate a finalized rental', async () => {
    // at stage 1, can be closed
    let rental2copy = await mockRequest.delete(`/rentaldoc/${rental2.body._id}`);
    expect(rental2copy.status).toEqual(200);

    // at stage 2, can't be closed
    let rental1copyDelete = await mockRequest.delete(`/rentaldoc/${rental1.body._id}`);
    expect(rental1copyDelete.status).toEqual(406);

    // increment process
    await mockRequest.put(`/rentaldoc/${rental1.body._id}`);

    // at stage 3, can't be closed
    let rental1copy2delete = await mockRequest.delete(`/rentaldoc/${rental1.body._id}`);
    expect(rental1copy2delete.status).toEqual(406);

    // increment process
    await mockRequest.put(`/rentaldoc/${rental1.body._id}`);
    //at stage 4, can be closed
    let rental2copy3del = await mockRequest.delete(`/rentaldoc/${rental1.body._id}`);
    expect(rental2copy3del.status).toEqual(200);
  });

  it('will update the related item _custodyId as the rental process increments', async () => {
    // make a new rental doc
    rental3 = await mockRequest.post('/rentaldoc').send(rental3data);
    let item3 = await mockRequest.get(`/item/${rental3.body._item}`);
    // console.log('item3', item3.body);
    expect(item3.body[0]._owner === item3.body[0]._custodyId).toEqual(true);

    let rental3_2 = await mockRequest.put(`/rentaldoc/${rental3.body._id}`);
    let item3V2 = await mockRequest.get(`/item/${item3.body[0]._id}`);
    // console.log('item3V2', item3V2.body);
    expect(item3V2.body[0]._owner === item3V2.body[0]._custodyId).toEqual(false);

    let rental3_3 = await mockRequest.put(`/rentaldoc/${rental3.body._id}`);
    let item3V3 = await mockRequest.get(`/item/${item3.body[0]._id}`);
    // console.log('item3V3', item3V3.body);
    expect(item3V3.body[0]._owner === item3V3.body[0]._custodyId).toEqual(false);

    let rental3_4 = await mockRequest.put(`/rentaldoc/${rental3.body._id}`);
    let item3V4 = await mockRequest.get(`/item/${item3.body[0]._id}`);
    // console.log('item3V4', item3V4.body);
    expect(item3V4.body[0]._owner === item3V4.body[0]._custodyId).toEqual(true);
    // expect(rental3_4.body.)

  });

});
