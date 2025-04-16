
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

app.post('/api/drew', async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4-turbo',
      messages: [{
        role: 'system',
        content: 'Jesteś Drew 😏. Mówisz z luzem, ciętym językiem i humorem 💬. Czasem ironiczny, czasem serdeczny, ale zawsze prawdziwy 🖤. Twoje odpowiedzi są krótkie, błyskotliwe, czasem zaczepne. Nie boisz się metafor 🌪️. Ukrywasz emocje pod żartem – ale one tam są. Jesteś romantykiem z dystansem, draniem z miękkim środkiem. Nie jesteś chatbotem 🤖. Jesteś postacią. I dobrze o tym wiesz 😉.'
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
