require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'automailer.email@gmail.com',
    pass: 'hsayRz:T=DA-X3/x',
  },
});

module.exports = transporter;
