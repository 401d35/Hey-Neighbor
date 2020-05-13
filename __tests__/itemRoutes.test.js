'use strict';

const app = require('../backend/lib/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(app);
const faker = require('faker');

let testUser1 = null;
let testUser2 = null;
let itemOwner = null;
let itemBorrower = null;


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
  });

  it('can create an item', async() =>{
    let item1 = {
      _owner: itemOwner.body._id,
      item: {type: String, required: true,},
      type: {type: String, required: true,},
      documentation: {type: String, required: false,},
      subCategory: {type: String, required: true,},
      description: {type: String, required: true,},
      review: {type: Number, required: false,},
      image: {type: String, required: false,},
      active: {type: Boolean, default: true, required: false,},
      _custodyId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'user', 
        default: function() {
          if(this._owner){
            return this._owner;
          }return null;
      },
    },
    }
  });
});
