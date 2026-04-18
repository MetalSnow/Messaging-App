const express = require('express');
const {
  getAllFriends,
  sendRequest,
  updateReqStatus,
  deleteReq,
} = require('../controllers/friends.controller');
const { isAuth } = require('../middlewares/authMiddleware');

const friendsRouter = express.Router();

friendsRouter.use(isAuth);

friendsRouter.get('/friends', getAllFriends);
friendsRouter.post('/friend-requests/:recipientId', sendRequest);
friendsRouter.patch('/friend-requests/:senderId', updateReqStatus);
friendsRouter.delete('/friend-requests/:senderId', deleteReq);

module.exports = friendsRouter;
