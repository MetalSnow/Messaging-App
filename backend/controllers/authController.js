const asyncHandler = require('express-async-handler');
const prisma = require('../config/prismaClient');
const bcrypt = require('bcryptjs');

const signupUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  res.json({
    data: user,
    message: '"Account created successfully. You can now log in."',
  });
});

const loginUser = asyncHandler((req, res) => {
  const user = req.user;
  res.json({ data: user, message: 'Login successful.' });
});

module.exports = { signupUser, loginUser };
