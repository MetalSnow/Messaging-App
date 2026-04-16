const asyncHandler = require('express-async-handler');
const prisma = require('../config/prismaClient');
const bcrypt = require('bcryptjs');

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

const updateUserInfo = asyncHandler(async (req, res) => {
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

  res.json({
    data: user,
    message: 'Account updated!',
  });
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  const isMatched = await bcrypt.compare(oldPassword, req.user.password);
  console.log(req.user.password);

  if (!isMatched) {
    return res.status(401).json({ message: 'Old password is incorrect.' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  res.json({
    data: user,
    message: 'Password changed',
  });
});

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
  findUsers,
  updateUserInfo,
  updateUserPassword,
  deleteUser,
};
