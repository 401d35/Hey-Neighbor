require('dotenv').config();
require('../../schemas/model');
require('../../routes/userRoutes');


let access_token = '';
const superagent = require('superagent');
const client_id = process.env.OAUTH_CLIENT_ID;
const client_secret = process.env.OAUTH_CLIENT_SECRET;
const tokenEndPoint = 'https://accounts.google.com/o/oauth2/v2/auth';
const remoteAPI = 'http://localhost:3000/oauth';

module.exports = async function googleOAuth(req, res, next) {
  try {
    let code = req.body.id_token;
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
  };

    async function exchangeCodeForToken(code) {
        let query = {
            code: code,
            client_id: process.env.OAUTH_CLIENT_ID,
            redirect_uri: 'http://localhost:3000/oauth',
            response_type: 'token',
            scope: 'https://www.googleapis.com/auth/userinfo.profile',
            include_granted_scopes: 'true',
            state: 'pass-through value',
        };
        try {
            let token_response = await superagent.post(tokenEndPoint).send(query);
            console.log(token_response);
            // console.log('this is the access token*****************', token_response);
        } catch (e) {
            console.log('error', e);
        }
        // console.log('I am a token response', token_response);

        return token_response;
    }
    async function getRemoteUserInfo(remoteToken) {
        return user;
    }

    async function getUser(remoteUser) {
        let userRecord = {
            username: remoteUser.login,
            password: 'oauthpassword'
        }
        let user = await users.save(userRecord);
        let token = users.generateToken(user);
        return [user, token];
    }
}