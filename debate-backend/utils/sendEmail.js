// utils/sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Replace with your email provider
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

async function sendEmail(to, subject, text) {
  try {
    await transporter.sendMail({
      from: '"Debate Platform" <your-email@gmail.com>',
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
}

module.exports = sendEmail;
