const nodemailer = require('nodemailer');
const {auth} = require("./config.json")["development"]
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth
});

module.exports = transporter;