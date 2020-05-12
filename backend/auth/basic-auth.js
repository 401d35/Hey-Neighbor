'use strict'; 

const bcrypt = require('bcryptjs');
const Users = require('../schemas/user-schema');
const base64 = require('base64')

module.exports = async function( req, res, next) {
    if(!req,headers.authorization) {
        next('Not a Valid Login');
    }
}

let basicAuth = req.headers.authorization.split(' ').pop();
let [user, authorize] = base64.decode(basicAuth).split(':');
let returns = await Users.findOne({username:user,});

const validUser = await bcrypt.compare(authorize,returns.password);

if(validUser) {
    let sameUser = new Users(returns);
    let token = await sameUser.generateToken();
    req.token = token;
    next();
}
else {
    next('invalid login information');
}