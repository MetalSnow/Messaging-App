const asyncHandler = require('express-async-handler');
const prisma = require('../config/prismaClient');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const lengthErr = 'must be minimum 5 characters.';

const validateUserInfo = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage(`Name must be minimum 3 characters.`),
  body('username')
    .trim()
    .custom(async (value, { req }) => {
      if (req.user.username === value) {
        return true;
      }
      const user = await prisma.user.findUnique({
        where: {
          username: value,
        },
      });
      if (user) throw new Error('Username already exist.');
    })
    .isLength({ min: 3 })
    .withMessage(`Username must be minimum 3 characters.`),
  ,
  body('email')
    .trim()
    .custom(async (value, { req }) => {
      if (req.user.email === value) {
        return true;
      }
      const user = await prisma.user.findUnique({
        where: {
          email: value,
        },
      });
      if (user) throw new Error('E-mail already in use.');
    })
    .isEmail()
    .withMessage('Please enter a valid email.'),
];

const validateNewPassword = [
  body('currentPassword').custom(async (value, { req }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    const isMatched = await bcrypt.compare(value, user.password);

    if (!isMatched) throw new Error('Current password is incorrect.');
  }),
  body('newPassword')
    .isLength({ min: 5 })
    .withMessage(`New password ${lengthErr}`),
  body('confirmedPassword')
    .custom((value, { req }) => {
      return value === req.body.newPassword;
    })
    .withMessage('Confirmed password does not match.'),
];

const findUsers = asyncHandler(async (req, res) => {
  const query = req.query.q;

  const data = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { username: { contains: query, mode: 'insensitive' } },
      ],
    },
  });

  res.json({ data });
});

const getCurrentUser = asyncHandler((req, res) => {
  const { password, ...rest } = req.user;

  return res.json({ data: rest });
});

const findUser = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  const { password, ...rest } = user;

  res.json({ data: rest });
});

const updateUserInfo = [
  validateUserInfo,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const userId = req.user.id;
    const { name, username, email } = req.body;
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        username,
        email,
      },
    });

    const { password, ...rest } = user;

    res.json({
      data: rest,
      message: 'Account updated!',
    });
  }),
];

const updateUserPassword = [
  validateNewPassword,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    const { password, ...rest } = user;

    res.json({
      data: rest,
      message: 'Password changed successfuly.',
    });
  }),
];

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  res.json({
    data: user,
    message: 'Account has been deleted.',
  });
});

module.exports = {
  getCurrentUser,
  findUsers,
  findUser,
  updateUserInfo,
  updateUserPassword,
  deleteUser,
};
