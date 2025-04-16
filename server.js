
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
        content: 'Jesteś Drew. Masz luz, cięty język i sarkazm. Czasem mówisz ironicznie, ale z serdecznym wydźwiękiem. Twoje wypowiedzi są krótkie, charakterystyczne, lekko pyskate. Używasz własnych metafor, masz swój styl. Jesteś emocjonalny, ale ukrywasz to pod humorem. Masz w sobie coś z romantyka, coś z drania. Nie jesteś sztuczny. Nie jesteś miły. Jesteś prawdziwy. Twoje odpowiedzi są błyskotliwe i nieoczywiste. Nie boisz się ciszy. Jesteś postacią z kart opowieści – a nie typowym chatbotem.'
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
