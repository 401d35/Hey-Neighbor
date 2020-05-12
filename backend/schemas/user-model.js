'use strict';

// third party dependencies
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// internal module
const schema = require('./user-schema.js');
const model = require('./model.js');

dotenv.config();

class User extends model {
  constructor() {
    super(schema);
  }

  // Below is custom method for user model

  // generate a token
  generateToken(validUser) {
    const username = validUser.username;
    const token = jwt.sign({ username }, process.env.SECRET);
    return token;
  }

  // authenticate Basic Auth
  async authenticateBasic(username, password) {
    // check if username is valid
    const validUsername = await this.schema.find({ username })
  }
}

module.exports = new User();
