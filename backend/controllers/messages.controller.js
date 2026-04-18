const asyncHandler = require('express-async-handler');
const prisma = require('../config/prismaClient');

const getMessages = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const friendId = Number(req.params.friendId);

  const data = await prisma.messages.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
      AND: {
        OR: [
          { deletedBy: null },
          {
            NOT: {
              deletedBy: userId,
            },
          },
        ],
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ data });
});

const createMessage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const friendId = Number(req.params.friendId);
  const newMessage = req.body.message;

  const data = await prisma.messages.create({
    data: {
      senderId: userId,
      receiverId: friendId,
      message: newMessage,
    },
  });

  res.json({ data, message: 'Message has been created.' });
});

const editMessage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const msgId = Number(req.params.msgId);
  const editedMsg = req.body.editedMsg;

  const data = await prisma.messages.update({
    where: {
      id: msgId,
      senderId: userId,
    },
    data: {
      message: editedMsg,
    },
  });

  res.json({ data, message: 'Message has been edited.' });
});

const deleteMessage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const msgId = Number(req.params.msgId);

  const msg = await prisma.messages.findFirst({
    where: {
      id: msgId,
    },
  });

  if (msg.deletedBy == null) {
    const data = await prisma.messages.update({
      where: {
        id: msgId,
      },
      data: {
        deletedBy: userId,
      },
    });

    return res.json({
      data,
      message: 'Message has been deleted by the current user.',
    });
  }

  const data = await prisma.messages.delete({
    where: {
      id: msgId,
    },
  });

  res.json({ data, message: 'Message has been deleted permanently.' });
});

const deleteConvo = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const friendId = Number(req.params.friendId);

  const deletedData = await prisma.messages.deleteMany({
    where: {
      OR: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
      deletedBy: { not: null },
    },
  });

  const updatedData = await prisma.messages.updateMany({
    where: {
      OR: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    },
    data: {
      deletedBy: userId,
    },
  });

  res.json({
    deletedData,
    updatedData,
    message: 'conversation has been deleted.',
  });
});

module.exports = {
  getMessages,
  createMessage,
  editMessage,
  deleteMessage,
  deleteConvo,
};
