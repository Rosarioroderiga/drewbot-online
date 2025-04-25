const cron = require('node-cron');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = '/tmp/conversations.json';

// Funkcja wysyłająca rozmowy jako ładny czat
const sendConversationsEmail = async () => {
  if (!fs.existsSync(path)) {
    console.log('Brak rozmów do wysłania.');
    return;
  }

  const fileData = fs.readFileSync(path, 'utf8');
  let conversations = [];

  try {
    conversations = JSON.parse(fileData || '[]');
  } catch (err) {
    console.error('Nie udało się sparsować rozmów:', err);
    return;
  }

  if (conversations.length === 0) {
    console.log('Brak treści do wysłania.');
    return;
  }

  const chatFormat = conversations.map(entry => {
    return `Użytkownik: ${entry.userMessage}\nDrew: ${entry.drewReply}\n`;
  }).join('\n');

const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_SMTP_USER,
    pass: process.env.MAILGUN_SMTP_PASS
  }
});


  const mailOptions = {
  from: process.env.MAILGUN_SMTP_USER,
  to: 'rosario.roderiga@gmail.com',
  subject: `Raport DrewBota — ${new Date().toLocaleDateString()}`,
  text: chatFormat
};


  try {
    await transporter.sendMail(mailOptions);
    console.log('✉️ Dzienny e-mail z rozmową wysłany!');
    fs.writeFileSync(path, '[]');
  } catch (error) {
    console.error('Błąd wysyłki rozmowy:', error);
  }
};

// CRON: Wyślij rozmowy codziennie o 21:00
cron.schedule('0 19 * * *', async () => {
  console.log('⏰ 21:00 — DrewBot wysyła rozmowy!');
  await sendConversationsEmail();
});

module.exports = { sendConversationsEmail };
