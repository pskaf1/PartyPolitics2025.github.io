const nodemailer = require('nodemailer');

// Transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email templates
function generateTemplate(templateName, placeholders = {}) {
  const templates = {
    signupConfirmation: `
      <p>Hi {{firstName}},</p>
      <p>Thank you for signing up! Please click the link below to verify your email:</p>
      <a href="{{verificationUrl}}">Verify Email</a>
      <p>Best regards,<br>World Debate Channel Team</p>
    `,
  };

  let template = templates[templateName];
  if (!template) {
    throw new Error('Template not found');
  }

  Object.entries(placeholders).forEach(([key, value]) => {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });

  return template;
}

// Send email function
async function sendEmail(to, subject, text, html = null) {
  try {
    const info = await transporter.sendMail({
      from: `"World Debate Channel" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      ...(html && { html }),
    });
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
    throw new Error('Failed to send email');
  }
}

module.exports = { sendEmail, generateTemplate };
