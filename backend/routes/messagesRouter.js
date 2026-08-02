const express = require('express');
const {
  getMessages,
  editMessage,
  deleteMessage,
  deleteConvo,
  createMessage,
} = require('../controllers/messages.controller');
const { isAuth } = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const messagesRouter = express.Router();

messagesRouter.use(isAuth);

messagesRouter.get('/msgs/:friendId', getMessages);
messagesRouter.post(
  '/msgs/:friendId',
  upload.single('messageImg'),
  createMessage,
);
messagesRouter.patch('/msg/:msgId', editMessage);
messagesRouter.delete('/msg/:msgId', deleteMessage);
messagesRouter.delete('/conversation/:friendId', deleteConvo);

module.exports = messagesRouter;
