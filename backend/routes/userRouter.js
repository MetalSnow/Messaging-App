const express = require('express');
const {
  signupUser,
  loginUser,
  findUsers,
} = require('../controllers/userController');
const { authenticate, isAuth } = require('../middlewares/authMiddleware');

const userRouter = express.Router();

userRouter.get('/users', isAuth, findUsers);
userRouter.post('/sign-up', signupUser);
userRouter.post('/log-in', authenticate, loginUser);

module.exports = userRouter;
