const fs = require('fs');
const path = require('path');

// Ścieżka do pliku rozmów
const conversationsDir = path.join(__dirname, 'conversations');
const conversationsFile = path.join(conversationsDir, 'conversations.json');

const logConversation = (userMessage, drewReply) => {
  try {
    // Jeśli folder nie istnieje – stwórz go
    if (!fs.existsSync(conversationsDir)) {
      fs.mkdirSync(conversationsDir, { recursive: true });
    }

    let conversationHistory = [];

    // Jeśli plik istnieje – wczytaj istniejące rozmowy
    if (fs.existsSync(conversationsFile)) {
      const fileData = fs.readFileSync(conversationsFile, 'utf8');
      conversationHistory = JSON.parse(fileData || '[]');
    }

    // Nowy wpis
    const logEntry = {
      timestamp: new Date().toISOString(),
      userMessage,
      drewReply
    };

    // Dodaj wpis i zapisz z powrotem
    conversationHistory.push(logEntry);
    fs.writeFileSync(conversationsFile, JSON.stringify(conversationHistory, null, 2));

  } catch (error) {
    console.error('Drew próbował zapisać rozmowę, ale coś jebło:', error);
  }
};

module.exports = logConversation;
