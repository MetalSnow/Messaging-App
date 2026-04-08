const express = require('express');
const { isAuth } = require('../middlewares/authMiddleware');
const { getProfile } = require('../controllers/profileController');

const profileRouter = express.Router();

profileRouter.get('/profile/:username', isAuth, getProfile);

module.exports = profileRouter;
