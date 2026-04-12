const express = require('express');
const { getAllFriends } = require('../controllers/friendsController');
const { isAuth } = require('../middlewares/authMiddleware');

const friendsRouter = express.Router();

friendsRouter.get('/friends/:id', isAuth, getAllFriends);

module.exports = friendsRouter;
