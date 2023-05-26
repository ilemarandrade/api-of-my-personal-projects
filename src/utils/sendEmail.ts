import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_TO_SEND_EMAIL, // generated ethereal user
    pass: process.env.PASSWORD_TO_SEND_EMAIL, // generated ethereal password
  },
});

export { transporter };
