/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
'use strict';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const faker = require('faker');
const Model = require('../backend/schemas/model.js');
const schema = require('../backend/schemas/user-schema.js');

const model = new Model(schema);

const mongoServer = new MongoMemoryServer();

beforeAll(async () => {
  // mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, (err) => {
    if (err) console.error(err);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// generic model has 5 methods - create, get, update, delete, getActive
describe('Test for Generic Model', () => {
  it('should be able to create a record', async () => {
    const testUser1 = {
      userName: 'test1',
      password: faker.internet.password(),
      email: faker.internet.email(),
      address: faker.address.streetAddress(),
      active: true,
    };

    const record1 = await model.create(testUser1);

    expect(record1.userName).toEqual('test1');
    expect(record1.active).toEqual(true);
  });

  it('shoud retrieve a specific record or records from a database', async () => {
    const testUser2 = {
      userName: 'test2',
      password: faker.internet.password(),
      email: faker.internet.email(),
      address: faker.address.streetAddress(),
      active: false
    };

    const record2 = await model.create(testUser2);
    const records = await model.get(); // return with two records
    const _id1 = records[0]._id; // get first record id
    const _id2 = records[1]._id; // get second record id
    const user1 = await model.get(_id1);
    const user2 = await model.get(_id2);

    expect(user1[0].userName).toEqual('test1');
    expect(user1[0].active).toEqual(true);
    expect(user2[0].userName).toEqual('test2');
    expect(user2[0].active).toEqual(false);
    expect(records.length).toEqual(2);
  });

  it('should update a record by id', async () => {
    const testUser3 = {
      userName: 'test3',
      password: faker.internet.password(),
      email: faker.internet.email(),
      address: faker.address.streetAddress(),
      active: false,
    };

    const record3 = await model.create(testUser3);
    const records = await model.get(); // return with three records
    const _id3 = records[2]._id; // retrieve third record id
    const beforeResult = await model.get(_id3); // retrieve third record
    expect(beforeResult[0].userName).toEqual('test3'); // test third record before update
    expect(beforeResult[0].active).toEqual(false); // test third record before update
    expect(records.length).toEqual(3);

    const newRecord = { active: true };
    const afterResult = await model.update(_id3, newRecord); // record used for updating
    expect(afterResult.userName).toEqual('test3'); //test third record after update
    expect(afterResult.active).toEqual(true); // test third record after update
  });

  it('should delete a record by id', async () => {
    const records = await model.get();
    const _id3 = records[2]._id;
    // should delete a record with _id3
    const result = await model.delete(_id3);
    const recordsAfterDeletion = await model.get();

    expect(result.userName).toEqual('test3');
    expect(recordsAfterDeletion[2]).toBeUndefined();
    expect(recordsAfterDeletion.length).toEqual(2); // should only have two records after delete one record
  });

  it('should get only active users', async () => {
    const testUser4 = {
      userName: 'test4',
      password: faker.internet.password(),
      email: faker.internet.email(),
      address: faker.address.streetAddress(),
      active: true,
    };
    const record4 = await model.create(testUser4);
    const activeUsers = await model.getActive();

    expect(activeUsers.length).toEqual(2); // should return two active users - test1 and test4
    expect(activeUsers[0].userName).toEqual('test1');
    expect(activeUsers[1].userName).toEqual('test4');
  });
});

