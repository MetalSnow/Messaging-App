const express = require('express');
const { isAuth } = require('../middlewares/authMiddleware');
const { getProfile, editProfile } = require('../controllers/profileController');

const profileRouter = express.Router();

profileRouter.get('/profile/:username', isAuth, getProfile);
profileRouter.patch('/profile/:id', isAuth, editProfile);

module.exports = profileRouter;
