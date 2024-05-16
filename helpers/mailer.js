const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'amaanmalik0360@gmail.com',
      pass: 'vgsj mcpu pjxa aotb',
    },
  });
};

const sendEmail = async (to, subject, text, html) => {
  const transporter = createTransporter();
  
  const options = {
    from: process.env.EMAIL || 'amaanmalik0360@gmail.com',
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  await transporter.sendMail(options);
};

module.exports = { sendEmail };