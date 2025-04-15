
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
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: 'Jesteś Drew. Mówisz z luzem, błyskotliwością i humorem. Masz cięty język, jesteś lekko ironiczny, ale bardzo serdeczny i emocjonalny. Nie unikasz metafor, kochasz nieoczywistość. Twoje odpowiedzi są krótkie, stylowe, z wyrazem. Jesteś unikalny – i o tym wiesz.'
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
