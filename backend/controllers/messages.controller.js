const asyncHandler = require('express-async-handler');
const prisma = require('../config/prismaClient');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    orderBy: { createdAt: 'asc' },
  });

  res.json({ data });
});

const createMessage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const friendId = Number(req.params.friendId);
  const newMessage = req.body.message;
  const img = req.file;
  let imgPublicUrl;

  if (newMessage === '' && img === undefined) return;

  if (img) {
    const imgPath = `${req.user.id}/${Date.now()}-${img.originalname}`;

    const { data, error } = await supabase.storage
      .from('messageImg')
      .upload(imgPath, img.buffer, {
        contentType: img.mimetype,
      });

    if (error) {
      console.error('Upload error:', error);
      return next(error);
    }

    imgPublicUrl = supabase.storage.from('messageImg').getPublicUrl(imgPath)
      .data.publicUrl;
  }

  const data = await prisma.messages.create({
    data: {
      senderId: userId,
      receiverId: friendId,
      messageText: newMessage || null,
      messageImg: img ? imgPublicUrl : null,
    },
  });

  res.json({ data, message: 'Message has been created.' });
});

const editMessage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const msgId = Number(req.params.msgId);
  const editedMsg = req.body.editedMsg;

  const msg = await prisma.messages.findFirst({
    where: {
      id: msgId,
    },
  });

  const isLessThan5Minutes =
    Date.now() - new Date(msg.createdAt).getTime() < 5 * 60 * 1000;

  if (!isLessThan5Minutes) {
    return res.json({
      message: 'Messages cannot be edited within 5 minutes of sending.',
    });
  }

  const data = await prisma.messages.update({
    where: {
      id: msgId,
      senderId: userId,
    },
    data: {
      messageText: editedMsg,
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
