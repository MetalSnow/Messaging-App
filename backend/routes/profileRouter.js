const express = require('express');
const { isAuth } = require('../middlewares/authMiddleware');
const {
  getProfile,
  editProfile,
} = require('../controllers/profile.controller');

const profileRouter = express.Router();

profileRouter.use(isAuth);

profileRouter.get('/profile/:username', getProfile);
profileRouter.patch('/profile/:id', editProfile);

module.exports = profileRouter;
