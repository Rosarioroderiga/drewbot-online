const logConversation = require('./logConversation');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

app.get('/ping', (req, res) => {
  res.status(200).send('Drew nie śpi. Wciąga latte przez nos.');
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

app.post('/api/drew', async (req, res) => {
  const { message } = req.body; // <-- pojedyncza wiadomość!

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });

    const drewReply = completion.data.choices[0].message.content.trim();

    // 💾 Zapisz rozmowę
    logConversation(message, drewReply);

    res.json({ reply: drewReply });
  } catch (error) {
    console.error('Błąd:', error);
    res.status(500).json({ reply: 'Drew właśnie zgubił zasięg. Serio.' });
  }
});

app.listen(port, () => {
  console.log(`DrewBot nasłuchuje na http://localhost:${port}`);
});
