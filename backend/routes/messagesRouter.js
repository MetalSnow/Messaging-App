const express = require('express');
const {
  getMessages,
  editMessage,
  deleteMessage,
  deleteConvo,
  createMessage,
} = require('../controllers/messages.controller');

const messagesRouter = express.Router();

messagesRouter.get('/msgs/:friendId', getMessages);
messagesRouter.post('/msgs/:friendId', createMessage);
messagesRouter.patch('/msg/:msgId', editMessage);
messagesRouter.delete('/msg/:msgId', deleteMessage);
messagesRouter.delete('/conversation/:friendId', deleteConvo);

module.exports = messagesRouter;
