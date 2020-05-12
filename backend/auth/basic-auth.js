'use strict'; 

const bcrypt = require('bcrypt');
const Users = require('../schemas/user-schema');

module.exports = async function( req, res, next) {
    if(!req,headers.authorization) {
        next('Not a Valid Login');
    }
}

const validUser = await bcrypt.compare(pass,returns.password);

if(validUser) {
    let sameUser = new Users(returns);
    let token = await sameUser.generateToken();
    req.token = token;
    next();
}
else {
    next('invalid login information');
}