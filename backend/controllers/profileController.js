const asyncHandler = require('express-async-handler');
const prisma = require('../config/prismaClient');

const getProfile = asyncHandler(async (req, res) => {
  const username = req.params.username;

  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  const profile = await prisma.profile.findFirst({
    where: {
      userId: user.id,
    },
  });

  res.json({ data: profile });
});

module.exports = { getProfile };
