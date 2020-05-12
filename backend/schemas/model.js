'use strict';

// this is generic mongoDB model

class Model {
  constructor(schema) {
    this.schema = schema;
  }

  // CRUD operations
  // Create
  create(record) {
    const newRecord = new this.schema(record);
    return newRecord.save();
  }

  // Read
  get(_id) {
    const queryObject = _id ? { _id } : {};
    return this.schema.find(queryObject);
  }

  // Update
  update(_id, record) {
    return this.schema.findByIdAndUpdate(_id, record, { new: true }); // return updated record
  }

  // Delete
  delete(_id) {
    return this.schema.findByIdAndDelete(_id);
  }
}

module.exports = Model;