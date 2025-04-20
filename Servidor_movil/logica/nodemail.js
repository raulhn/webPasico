const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

//https://ichi.pro/es/cree-su-propia-api-de-correo-con-nodemailer-gmail-y-google-oauth2-44935173737847

const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS,
} = process.env;

const oauth2Client = new OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  OAUTH_PLAYGROUND
);

oauth2Client.setCredentials({
  refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
});

/**
 * Send Email
 */

async function enviarEmail(to, subject, html) {
  console.log(SENDER_EMAIL_ADDRESS);
  const accessToken = await oauth2Client.getAccessToken();

  console.log("Access token: " + accessToken);
  return new Promise((resolve, reject) => {
    console.log(MAILING_SERVICE_REFRESH_TOKEN);
    const smtpTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SENDER_EMAIL_ADDRESS,
        clientId: MAILING_SERVICE_CLIENT_ID,
        clientSecret: MAILING_SERVICE_CLIENT_SECRET,
        refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    smtpTransport.sendMail(
      {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: subject,
        html: html,
      },
      (error, info) => {
        if (error) {
          console.error("Error al enviar el correo:", error);
          resolve({
            error: true,
            message: "Error al enviar el correo " + error,
          });
        } else {
          console.log("Correo enviado:", info.response);
          resolve({ error: false, message: "Correo enviado correctamente" });
        }
      }
    );
  });
}

module.exports.enviarEmail = enviarEmail;
