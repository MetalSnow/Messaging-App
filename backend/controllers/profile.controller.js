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

const editProfile = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id);
  const { name, bio, gender, profilePic, coverPic } = req.body;

  const data = await prisma.profile.update({
    where: {
      userId,
    },
    data: {
      name,
      bio,
      gender,
      profilePic,
      coverPic,
    },
  });

  res.json({ message: 'Profile updated!', profile: data });
});

module.exports = { getProfile, editProfile };
