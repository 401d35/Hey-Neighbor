require('dotenv').config();
require('../../schemas/model');
require('../../routes/userRoutes');


const superagent = require('superagent');
const client_id = process.env.OAUTH_CLIENT_ID;
const client_secret = process.env.OAUTH_CLIENT_SECRET;
const tokenEndPoint = 'https://accounts.google.com/o/oauth2/v2/auth';
const remoteAPI = 'http://localhost:3000/oauth';

module.exports = async function googleOAuth(req, res, next) {
    try {
        let code = req.body.idtoken;
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
            client_id: process.env.OAUTH_CLIENT_ID,
            redirect_uri: remoteAPI,
            response_type: 'token',
            scope: 'https://www.googleapis.com/auth/userinfo.profile',
            include_granted_scopes: 'true',
            state: 'pass-through value',
        };
        try {
            let token_response = await superagent.post(tokenEndPoint).send(query);
        } catch (e) {
            console.log('error', e);
        }
        console.log('this is the token response *****************', token_response);
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