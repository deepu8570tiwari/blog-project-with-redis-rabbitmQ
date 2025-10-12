const { google } = require("googleapis");
const dotenv = require("dotenv");
dotenv.config();

const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleSecretKEY = process.env.GOOGLE_CLIENT_SECRET;

const oauth2Client  = new google.auth.OAuth2(
    googleClientID,
    googleSecretKEY,
    "https://oauth.pstmn.io/v1/callback"
    //"http://localhost:3000/auth/google/callback" // <-- redirect URI
);

module.exports = oauth2Client;
