'use strict';

// third party modules
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// internal modules
const schema = require('./user-schema.js');
const model = require('./model.js');

dotenv.config();

class User extends model {
  constructor() {
    super(schema);
  }

  // Below are custom methods for user model

  // signup method to save user info in the database
  async signup(record) {
    // check if the username is already used
    const findUser = await this.schema.find({ userName: record.userName, });
    if (findUser.length) {
      return Promise.reject('This username has already been used, try other username!');
    } else {
      // if username is not registered, save the record. Hash the password before save the record
      const password = await bcrypt.hash(record.password, 5);
      record.password = password;
      return this.create(record);
    }
  }

  // generate a token
  generateToken(validUser) {
    const userName = validUser.userName;
    const token = jwt.sign({ userName, }, process.env.SECRET);
    return token;
  }

  // authenticate token
  async authenticateToken(token) {
    try {
      const tokenObject = jwt.verify(token, process.env.SECRET);
      const findUsername = await this.schema.find({ userName: tokenObject.userName });
      if (findUsername.length) {
        return Promise.resolve(tokenObject);
      } else {
        return Promise.reject('invalid login');
      }
    } catch (e) {
      return Promise.reject();
    }
  }

  // authenticate Basic Auth
  async authenticateBasic(userName, password) {
    // check if username is valid
    const validUsername = await this.schema.find({ userName, }).select('+password');
    if (validUsername.length) {
      // check if the password is valid
      const isPasswordValid = await bcrypt.compare(password, validUsername[0].password);
      if (isPasswordValid) {
        return validUsername[0];
      } else {
        return Promise.reject('password is invalid!');
      }
    } else {
      // else username is invalid
      return Promise.reject('username is invalid!');
    }
  }
}

module.exports = new User();
