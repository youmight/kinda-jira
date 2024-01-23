const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.net",
    port: 587,
    secure: false,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.GMAIL_SENDER_MAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const sendEmail = async (receiver, subject, text, html) => {
    const info = await transporter.sendMail({
        from: process.env.GMAIL_SENDER_MAIL,
        to: receiver,
        subject,
        text,
        html,
    });
    console.log("Message sent: %s", info.messageId);
    return true;
}

module.exports = sendEmail;