const express = require('express');
const {
  getCurrentUser,
  findUsers,
  updateUserInfo,
  deleteUser,
  updateUserPassword,
  findUser,
} = require('../controllers/user.controller');
const { isAuth } = require('../middlewares/authMiddleware');

const userRouter = express.Router();

userRouter.use(isAuth);

userRouter.get('/users', findUsers);
userRouter.get('/user', getCurrentUser);
userRouter.get('/user/:userId', findUser);
userRouter.patch('/user', updateUserInfo);
userRouter.patch('/user/password', updateUserPassword);
userRouter.delete('/user', deleteUser);

module.exports = userRouter;
