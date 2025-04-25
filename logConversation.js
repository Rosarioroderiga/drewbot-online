const fs = require('fs');
const path = '/tmp/conversations.json';

const logConversation = (userMessage, drewReply) => {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userMessage,
      drewReply
    };

    let conversationHistory = [];
    if (fs.existsSync(path)) {
      const fileData = fs.readFileSync(path, 'utf8');
      conversationHistory = JSON.parse(fileData || '[]');
    }

    conversationHistory.push(logEntry);

    fs.writeFileSync(path, JSON.stringify(conversationHistory, null, 2));

  } catch (error) {
    console.error('Drew próbował zapisać rozmowę, ale Render go walnął w łeb:', error);
  }
};

module.exports = logConversation;
