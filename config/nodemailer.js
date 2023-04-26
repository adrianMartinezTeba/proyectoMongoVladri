const nodemailer = require('nodemailer');
require("dotenv").config();
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
       user: process.env.USER,
       pass: process.env.PASS
    }
});

module.exports = transporter;