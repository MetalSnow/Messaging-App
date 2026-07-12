const express = require('express');
const { isAuth } = require('../middlewares/authMiddleware');
const {
  getProfile,
  editProfile,
} = require('../controllers/profile.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const profileRouter = express.Router();

profileRouter.use(isAuth);

profileRouter.get('/profile/:username', getProfile);
profileRouter.patch(
  '/profile/:id',
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'coverPic', maxCount: 1 },
  ]),
  editProfile,
);

module.exports = profileRouter;
