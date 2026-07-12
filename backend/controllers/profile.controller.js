const asyncHandler = require('express-async-handler');
const prisma = require('../config/prismaClient');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
  const { bio, gender } = req.body;
  const profilePic = req.files['profilePic'];
  const coverPic = req.files['coverPic'];
  let profilePath;
  let coverPath;

  if (profilePic) {
    profilePath = `${userId}/${Date.now()}-${profilePic[0].originalname}`;

    const { data, error } = await supabase.storage
      .from('avatar')
      .upload(profilePath, profilePic[0].buffer);

    if (error) {
      console.error('Upload error:', error);
      return next(error);
    }
  }

  if (coverPic) {
    coverPath = `${userId}/${Date.now()}-${coverPic[0].originalname}`;

    const { data, error } = await supabase.storage
      .from('cover')
      .upload(coverPath, coverPic[0].buffer);

    if (error) {
      console.error('Upload error:', error);
      return next(error);
    }
  }

  const data = await prisma.profile.update({
    where: {
      userId,
    },
    data: {
      bio,
      gender,
      profilePic: profilePath,
      coverPic: coverPath,
    },
  });

  res.json({ message: 'Profile updated!', profile: data });
});

module.exports = { getProfile, editProfile };
