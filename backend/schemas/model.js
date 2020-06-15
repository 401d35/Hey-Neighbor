/* eslint-disable new-cap */
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

  getActive(){
    let query = {active:true,};
    return this.schema.find(query);
  }

  async resave(_id){
    await this.schema.findById(_id, function(err, doc){
      if(doc){
        doc.save(function(){
        });
        return doc;
      }
    });
    let y = await this.schema.findById(_id);
    return y;
  }

  // update an item by _id ONLY if the owner is registered as having custody
  async deactivateItem(_id){
    let updatedFile = await this.schema.findOneAndUpdate({
      '_id':_id,
      $where:'this._owner.toString() === this._custodyId.toString()',
    }, // the query
    {'active':false,}, // what is updated
    { new: true, },); // returns the updated doc


    if(updatedFile === null){
      throw 'Error: Item is checked out. Can not deactivate at this time.';
    }else{
      return updatedFile;
    }
  }

  getTargetReviews(id, type){
    const queryObject = {_id:id, reviewType:type}
    return this.schema.find(queryObject);
  }

  getUserByName(name){
    console.log('name', name);
    const queryObject = {'userName':name};
    // let x = 
    // console.log('x', x);
    return this.schema.find({'userName':name});
  }

  getOwnerItems(_id){
    const queryObject = {_owner: _id};
    return this.schema.find(queryObject);
  }

  // Read
  get(_id) {
    const queryObject = _id ? { _id, } : {};
    return this.schema.find(queryObject);
  }

  // Update
  update(_id, record) {
    return this.schema.findByIdAndUpdate(_id, record, { new: true, }); // return updated record
  }

  // Delete
  delete(_id) {
    return this.schema.findByIdAndDelete(_id);
  }

  // get active users
  getActive(){
    const query = { active: true, };
    return this.schema.find(query);
  }
}

module.exports = Model;
