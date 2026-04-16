const asyncHandler = require('express-async-handler');
const prisma = require('../config/prismaClient');

const getAllFriends = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const users = await prisma.friends.findMany({
    where: {
      OR: [{ userId1: userId }, { userId2: userId }],
      status: 'ACCEPTED',
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

const sendRequest = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const recipientId = Number(req.params.recipientId);

  const data = await prisma.friends.create({
    data: {
      userId1: userId,
      userId2: recipientId,
    },
  });

  res.json({ data, message: 'Request sent' });
});

const updateReqStatus = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const senderId = Number(req.params.senderId);

  const data = await prisma.friends.update({
    where: {
      userId1_userId2: {
        userId1: senderId,
        userId2: userId,
      },
    },
    data: {
      status: 'ACCEPTED',
    },
  });

  res.json({ data, message: 'Request accepted' });
});

const deleteReq = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const senderId = Number(req.params.senderId);

  const data = await prisma.friends.deleteMany({
    where: {
      OR: [
        { userId1: senderId, userId2: userId },
        { userId1: userId, userId2: senderId },
      ],
    },
  });

  res.json({ data, message: 'Request Rejected' });
});

module.exports = { getAllFriends, sendRequest, updateReqStatus, deleteReq };
