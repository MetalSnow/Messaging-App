const express = require('express');
const { signupUser, loginUser } = require('../controllers/authController');
const passport = require('../config/passport');
const authenticate = require('../middlewares/authentication');

const authRouter = express.Router();

authRouter.post('/sign-up', signupUser);
authRouter.post('/log-in', authenticate, loginUser);

module.exports = authRouter;
