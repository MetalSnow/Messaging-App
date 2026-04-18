const express = require('express');
const {
  findUsers,
  updateUserInfo,
  deleteUser,
  updateUserPassword,
} = require('../controllers/user.controller');
const { isAuth } = require('../middlewares/authMiddleware');

const userRouter = express.Router();

userRouter.use(isAuth);

userRouter.get('/users', findUsers);
userRouter.patch('/user', updateUserInfo);
userRouter.patch('/user/password', updateUserPassword);
userRouter.delete('/user', deleteUser);

module.exports = userRouter;
