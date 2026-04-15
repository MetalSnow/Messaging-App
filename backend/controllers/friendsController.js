const asyncHandler = require('express-async-handler');
const prisma = require('../config/prismaClient');

const getAllFriends = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id);

  const users = await prisma.friends.findMany({
    where: {
      OR: [{ userId1: userId }, { userId2: userId }],
      status: 'Accepted',
    },
  });

  // filter current user's friends
  const friends = users.map((obj) =>
    obj.userId1 !== userId ? obj.userId1 : obj.userId2,
  );

  const data = await prisma.user.findMany({
    where: {
      id: {
        in: friends,
      },
    },
  });

  res.json({ data });
});

module.exports = { getAllFriends };
