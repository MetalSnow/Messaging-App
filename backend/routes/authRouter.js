const express = require('express');
const { signupUser, loginUser } = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

const authRouter = express.Router();

authRouter.post('/sign-up', signupUser);
authRouter.post('/log-in', authenticate, loginUser);

module.exports = authRouter;
