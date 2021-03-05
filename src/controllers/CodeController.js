const fs = require('fs');

const { google } = require('googleapis');
const { setAuth, getAuth } = require('../auth/googleAuth');

const TOKEN_PATH = 'token.json';

function setCode(req, res) {
    const { code } = req.body;


    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Gmail API.
        authorize(JSON.parse(content), saveAuth);
    });

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }

    function getNewToken(oAuth2Client, callback) {
        oAuth2Client.getToken(code, (err, token) => {

            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    }

    return res.json({ ok: true });
}

function getToken(req, res) {
    let auth = getAuth();
    return res.json({ token: auth.credentials.access_token })
}

function saveAuth(oAuth2Client) {
    setAuth(oAuth2Client);
}

module.exports = { setCode, getToken };