const fs = require('fs');

const logConversation = (userMessage, drewReply) => {
  const path = '/tmp/conversations.json';

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
};

module.exports = logConversation;
