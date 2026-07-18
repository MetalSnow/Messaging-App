const express = require('express');
const {
  getAllFriends,
  sendRequest,
  updateReqStatus,
  deleteReq,
  getFriendReqs,
} = require('../controllers/friends.controller');
const { isAuth } = require('../middlewares/authMiddleware');

const friendsRouter = express.Router();

friendsRouter.use(isAuth);

friendsRouter.get('/friends', getAllFriends);
friendsRouter.get('/friend-requests', getFriendReqs);
friendsRouter.post('/friend-requests/:recipientId', sendRequest);
friendsRouter.patch('/friend-requests/:senderId', updateReqStatus);
friendsRouter.delete('/friend-requests/:senderId', deleteReq);

module.exports = friendsRouter;
