require('dotenv').config();
require('../../schemas/model');
require('../../routes/userRoutes');

const superagent = require('superagent');

const client_id = process.env.OAUTH_CLIENT_ID;
const client_secret = process.env.OAUTH_CLIENT_SECRET;
const tokenEndPoint = 'https://accounts.google.com/o/oauth2/v2/auth';
const remoteAPI = 'https://hey-neighbor.netlify.app/';

module.exports = async function authorize(req, res, next) {
    try {
        let code = req.query.code;
        console.log('(1) CODE:', code);

        let remoteToken = await exchangeCodeForToken(code);
        console.log('(2) ACCESS TOKEN:', remoteToken)

        let remoteUser = await getRemoteUserInfo(remoteToken);
        console.log('(3) GITHUB USER', remoteUser)

        let [user, token] = await getUser(remoteUser);
        req.user = user;
        req.token = token;
        console.log('(4) LOCAL USER', user);

        next();
    } catch (e) {
        next(`ERROR: ${e.message}`)
    }

    async function exchangeCodeForToken(code) {

        let tokenResponse = await superagent.post(tokenServerUrl).send({
                client_id: 'process.env.OAUTH_CLIENT_ID ',
                redirect_uri: 'Netlify address needs to go here',
                response_type: 'token',
                scope: 'https://www.googleapis.com/auth/userinfo.profile',
                include_granted_scopes: 'true',
                state: 'pass-through value',
            });
        }

    let access_token = tokenResponse.body.access_token;

    return access_token;

    
    async function getRemoteUserInfo(token) {
        
        let userResponse =
        await superagent.get(remoteAPI)
        .set('user-agent', 'express-app')
        .set('Authorization', `token ${token}`)
        
        let user = userResponse.body;
        
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
    