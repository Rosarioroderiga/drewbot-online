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
  const { messages } = req.body; // <-- TERAZ pobieramy całą historię!

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4-turbo',
      messages: messages // <-- przekazujemy całą historię
    });

    const drewReply = completion.data.choices[0].message.content.trim();

    // 💾 Zapisz ostatnie pytanie i odpowiedź Drew
    const lastUserMessage = messages.findLast(m => m.role === "user")?.content || "Brak pytania.";
    logConversation(lastUserMessage, drewReply);

    res.json({ reply: drewReply });
  } catch (error) {
    console.error('Błąd:', error);
    res.status(500).json({ reply: 'Drew właśnie zgubił zasięg. Serio.' });
  }
});

const fs = require('fs');
const path = '/tmp/conversations.json';

app.get('/conversations', (req, res) => {
  try {
    if (fs.existsSync(path)) {
      const data = fs.readFileSync(path, 'utf8');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(data);
    } else {
      res.status(200).send('Brak zapisanych rozmów. Drew może był offline.');
    }
  } catch (err) {
    console.error('Błąd podczas odczytu rozmów:', err);
    res.status(500).send('Ups. Drew próbował coś znaleźć, ale się zgubił.');
  }
});


app.listen(port, () => {
  console.log(`DrewBot nasłuchuje na http://localhost:${port}`);
});
