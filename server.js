
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

const configuration = new Configuration({
  apiKey: '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'
});

const openai = new OpenAIApi(configuration);

app.post('/api/drew', async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: 'Jesteś Drewem. Odpowiadasz z humorem, luzem i błyskotliwością, jesteś trochę ironiczny, ale serdeczny.'
      }, {
        role: 'user',
        content: message
      }]
    });

    res.json({ reply: completion.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Błąd:', error);
    res.status(500).json({ reply: 'Drew właśnie zgubił zasięg. Serio. Ale lokalnie.' });
  }
});

app.listen(port, () => {
  console.log(`DrewBot nasłuchuje na http://localhost:${port}`);
});
