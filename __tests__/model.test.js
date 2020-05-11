'use strict';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Model = require('../backend/schemas/model.js');

const test = mongoose.Schema({
  username: String,
  password: String
});

const schema = mongoose.model('test', test);
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

// generic model has 4 methods - create, get, update, delete
describe('Test for Generic Model', () => {
  it('should be able to create a record', async () => {
    const record1 = await model.create({ username: 'test1', password: 'test' });

    expect(record1.username).toBe('test1');
    expect(record1.password).toBe('test');
  });

  it('shoud retrieve a specific record or records from a database', async () => {
    const record2 = await model.create({ username: 'test2', password: 'test' });
    const records = await model.get();
    const _id1 = records[0]._id;
    const _id2 = records[1]._id;
    const user1 = await model.get(_id1);
    const user2 = await model.get(_id2);

    expect(user1[0].username).toBe('test1');
    expect(user2[0].username).toBe('test2');
    expect(records.length).toBe(2);
  });

  it('should update a record by id', async () => {
    const records = await model.get();
    const _id1 = records[0]._id;
    const newRecord = { username: 'test10', password: 'test10' };
    const result = await model.update(_id1, newRecord);

    expect(result.username).toBe('test10');
    expect(result.password).toBe('test10');
  });

  it('should delete a record by id', async () => {
    const records = await model.get();
    const _id2 = records[1]._id;
    // should delete a record with _id2
    const result = await model.delete(_id2);
    const recordsAfterDeletion = await model.get();

    expect(result.username).toBe('test2');
    expect(recordsAfterDeletion[1]).toBeUndefined();
  })
});

