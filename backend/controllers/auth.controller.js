const asyncHandler = require('express-async-handler');
const prisma = require('../config/prismaClient');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const lengthErr = 'must be minimum 3 characters.';

const validateUser = [
  body('username')
    .trim()
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: {
          username: value,
        },
      });
      if (user) throw new Error('Username already exist.');
    })
    .isLength({ min: 2 })
    .withMessage(`Username ${lengthErr}`),
  ,
  body('email')
    .trim()
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: {
          email: value,
        },
      });
      if (user) throw new Error('E-mail already in use.');
    })
    .isEmail()
    .withMessage('Please enter a valid email.'),
  body('password')
    .isLength({ min: 5 })
    .withMessage('Password must be minimum 5 characters.'),
  body('confirmedPassword')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('Confirmed password does not match.'),
];

const signupUser = [
  validateUser,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { username, email, password: pswd } = req.body;
    const hashedPassword = await bcrypt.hash(pswd, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const { password, ...rest } = user;

    res.json({
      success: true,
      data: rest,
      message: 'Account created successfully. You can now log in.',
    });
  }),
];

const loginUser = asyncHandler((req, res) => {
  const { password, ...user } = req.user;
  res.json({ success: true, data: user, message: 'Login successful.' });
});

module.exports = {
  signupUser,
  loginUser,
};
