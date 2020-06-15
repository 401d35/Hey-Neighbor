// require('../../schemas/model');
// require('../../routes/userRoutes');
const dotenv = require('dotenv');
dotenv.config();
const users = require('../../schemas/user-model.js');
const superagent = require('superagent');
const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_SECRET_ID;
const TOKEN_END_POINT = process.env.TOKEN_END_POINT;
const REDIRECT_URI = process.env.REDIRECT_URI;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

module.exports = async function googleOAuth(req, res, next) {
  try {
    let code = req.query.code;
    console.log('(1) CODE:', code);
    let remoteToken = await exchangeCodeForToken(code);
    console.log('(2) ACCESS TOKEN:', remoteToken);
    let remoteUser = await getRemoteUserInfo(remoteToken);
    console.log('(3) GOOGLE USER', remoteUser);
    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    console.log('(4) LOCAL USER', user);
    next();
  } catch (e) {
    next(`ERROR: ${e.message}`);
  }
};

async function exchangeCodeForToken(code) {
  let query = {
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code'
  };

  const tokenResponse = await superagent.post(TOKEN_END_POINT).send(query);
  const access_token = tokenResponse.body.access_token;
  return access_token;
}

async function getRemoteUserInfo(remoteToken) {
  const userResponse = await superagent.get(`${VERIFY_TOKEN}${remoteToken}`)
    .set('user-agent', 'express-app')
    .set('Authorization', `token ${remoteToken}`);
  return userResponse.body;
}

async function getUser(remoteUser) {
  let userRecord = {
    userName: remoteUser.email,
    password: 'oauthpassword',
    email: remoteUser.email,
    address: 'google'
  };
  let user = await users.saveRemoteUser(userRecord);
  let token = users.generateToken(user);
  return [user, token];
}
