require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_TO_SEND_EMAIL, // generated ethereal user
    pass: process.env.PASSWORD_TO_SEND_EMAIL, // generated ethereal password
  },
});

module.exports = {
  transporter,
};
