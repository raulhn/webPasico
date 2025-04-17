import nodemailer from "nodemailer";
import ejs from "ejs";
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
const Mailing = {};
const oauth2Client = new OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  OAUTH_PLAYGROUND
);
const TEMPLATES = {
  subscribe: {
    fileName: "subscribe.ejs",
    subject: "[ABC Inc.] Welcome to ABC Inc.",
  },
};
/**
 * Send Email
 */

function enviarEmail(from, subject, html) {
  return new Promise((resolve, reject) => {
    const smtpTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SENDER_EMAIL_ADDRESS,
        clientId: MAILING_SERVICE_CLIENT_ID,
        clientSecret: MAILING_SERVICE_CLIENT_SECRET,
        refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
        accessToken,
      },
    });

    smtpTransport.sendMail(
      {
        from: from,
        to: SENDER_EMAIL_ADDRESS,
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
