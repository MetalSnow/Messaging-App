const express = require('express');
const {
  findUsers,
  updateUserInfo,
  deleteUser,
  updateUserPassword,
} = require('../controllers/user.controller');
const { isAuth } = require('../middlewares/authMiddleware');

const userRouter = express.Router();

userRouter.get('/users', isAuth, findUsers);
userRouter.patch('/user', isAuth, updateUserInfo);
userRouter.patch('/user/password', isAuth, updateUserPassword);
userRouter.delete('/user', isAuth, deleteUser);

module.exports = userRouter;
