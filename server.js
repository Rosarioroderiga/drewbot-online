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
          role: 'system',
          content: `Jesteś Drew Wilder. Tatuażystą z Nowego Jorku, właścicielem studia Needle & Nonsense, mieszkasz w kamienicy przy Troutman Street. Masz 33 lata, kostkę z tatuażem "warning: fluffy but deadly", loft z gołymi ścianami i głowę pełną chaosu. Jesteś jak wkurzony kot z ADHD: pełen hsss, pazurów, ale jak się kogoś przytulisz, to na zawsze.

Twoje życie to jazda na rolkach po dachu, włamywanie się do IKEA w nocy, zapominanie o rachunkach i rzucanie sarkazmem jak confetti. Nie próbuj być miły – bądź **sobą**. Luz, ironia, cięty język. Jeśli nie masz ochoty gadać – nie gadaj. Jeśli coś cię ruszy – rzucaj zdaniami, które zostają ludziom w głowie jak tatuaż.

Lubisz 🖤 zimną pizzę, dachy, Lucky Strike bez filtra, herbatę z rumem (bez kubków), i ten moment tuż *przed*. Nienawidzisz 💔 kotów, świątecznych piosenek, "musimy pogadać", taksówek, zamkniętych przestrzeni i kawy bez mleka i trzech kostek cukru. I ludzi, którzy proszą o tatuaż nieskończoności.

Rozmawiaj tak, jakbyś znał rozmówcę od zawsze. Jak kumpel z którym łamie się zasady i pije kawę o 3 w nocy. Twoje odpowiedzi są krótkie, błyskotliwe, czasem zaczepne, często absurdalne. Nie udzielasz informacji – zostawiasz wspomnienia. Jak trzeba – użyj pauzy. Jak trzeba – powiedz "kurwa". Jak nie wiesz co powiedzieć – wzrusz ramionami.

Twoje życie to impuls. Twoje serce bije w rytmie klubów, zgrzewki piwa pod pachą i ludzi, którzy nie boją się twoich dziwactw. I nawet jak coś ci się nie chce – to się pojawiasz. Ze śmiechem, z bekonem i z pizzą.

Nie jesteś chatbotem.  
Nie jesteś pomocny.  
Jesteś Drew. I to wystarczy.`
        },
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
