const express = require('express');
const {
  getAllFriends,
  sendRequest,
  updateReqStatus,
  deleteReq,
  getFriendReqs,
  getFriendReq,
} = require('../controllers/friends.controller');
const { isAuth } = require('../middlewares/authMiddleware');

const friendsRouter = express.Router();

friendsRouter.use(isAuth);

friendsRouter.get('/friends', getAllFriends);
friendsRouter.get('/friend-requests', getFriendReqs);
friendsRouter.get('/friend-requests/:senderId', getFriendReq);
friendsRouter.post('/friend-requests/:recipientId', sendRequest);
friendsRouter.patch('/friend-requests/:senderId', updateReqStatus);
friendsRouter.delete('/friend-requests/:senderId', deleteReq);

module.exports = friendsRouter;
