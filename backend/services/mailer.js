const nodemailer = require('nodemailer');

/*
1. enable 2 steps verification in gmail account for the "FROM GMAIL".
2. GOTO https://myaccount.google.com/u/1/apppasswords and setup mail and windows computer and copy password and set it here
3. GOTO https://myaccount.google.com/u/1/lesssecureapps?authuser=1&pageId=none and enable less secure apps  and captcha
*/
async function mailSender({
  to, subject, html, text,
}) {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: process.env.EMAIL_SMTP_PORT,
    secure: true,
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_AUTH_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const info = await transport.sendMail({
    from: process.env.EMAIL_AUTH_ID,
    to,
    subject,
    html,
    text,
    // generateTextFromHTML: true,
  });
  return info;
}

module.exports = mailSender;
