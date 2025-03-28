const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: '"SCREENSAVER" <info@screensaver.win>',
    to,
    subject,
    text,
  });
  console.log("Email sent!");
}

module.exports = { sendEmail };