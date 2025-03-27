const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const container = require("./container.js");
const OAuth2 = google.auth.OAuth2;

// https://dev.to/drsimplegraffiti/send-email-using-oauth2-nodejs-the-right-way-5h32
const oauth2Client = new OAuth2(
  container.ID_CLIENTE_EMAIL,
  container.CLIENTE_SECRET_EMAIL, // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: container.REFRESH_TOKEN_EMAIL,
});

const accessToken = oauth2Client.getAccessToken();

function obtenerTransporter() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "amnspasico.redes@gmail.com",
      clientId: container.ID_CLIENTE_EMAIL,
      clientSecret: container.CLIENTE_SECRET_EMAIL,
      refreshToken: container.REFRESH_TOKEN_EMAIL,
      accessToken,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  return transporter;
}

module.exports.obtenerTransporter = obtenerTransporter;
