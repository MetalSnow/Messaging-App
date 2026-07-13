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

const editProfile = asyncHandler(async (req, res, next) => {
  const userId = Number(req.params.id);
  const { bio, gender } = req.body;
  const profilePic = req.files['profilePic'];
  const coverPic = req.files['coverPic'];
  let profilePublicUrl;
  let coverPublicUrl;

  if (profilePic) {
    const profilePath = `${userId}/${Date.now()}-${profilePic[0].originalname}`;

    const { data, error } = await supabase.storage
      .from('avatar')
      .upload(profilePath, profilePic[0].buffer, {
        contentType: profilePic[0].mimetype,
      });

    if (error) {
      console.error('Upload error:', error);
      return next(error);
    }

    profilePublicUrl = supabase.storage.from('avatar').getPublicUrl(profilePath)
      .data.publicUrl;
  }

  if (coverPic) {
    const coverPath = `${userId}/${Date.now()}-${coverPic[0].originalname}`;

    const { data, error } = await supabase.storage
      .from('cover')
      .upload(coverPath, coverPic[0].buffer, {
        contentType: coverPic[0].mimetype,
      });

    if (error) {
      console.error('Upload error:', error);
      return next(error);
    }

    coverPublicUrl = supabase.storage.from('cover').getPublicUrl(coverPath)
      .data.publicUrl;
  }

  const data = await prisma.profile.update({
    where: {
      userId,
    },
    data: {
      bio,
      gender,
      profilePic: profilePublicUrl,
      coverPic: coverPublicUrl,
    },
  });

  res.json({ message: 'Profile updated!', profile: data });
});

module.exports = { getProfile, editProfile };
