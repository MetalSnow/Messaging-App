const express = require('express');
const {
  getAllFriends,
  sendRequest,
  updateReqStatus,
  deleteReq,
} = require('../controllers/friends.controller');
const { isAuth } = require('../middlewares/authMiddleware');

const friendsRouter = express.Router();

friendsRouter.get('/friends', isAuth, getAllFriends);
friendsRouter.post('/friend-requests/:recipientId', isAuth, sendRequest);
friendsRouter.patch('/friend-requests/:senderId', isAuth, updateReqStatus);
friendsRouter.delete('/friend-requests/:senderId', isAuth, deleteReq);

module.exports = friendsRouter;
