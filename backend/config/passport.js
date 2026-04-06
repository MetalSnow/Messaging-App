const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const prisma = require('../config/prismaClient');
const bcrypt = require('bcryptjs');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (!user) {
        return done(null, false, { message: 'Incorrect Username' });
      }

      const isMatched = await bcrypt.compare(password, user.password);

      if (!isMatched) {
        return done(null, false, { message: 'Incorrect Passowrd' });
      }

      done(null, user);
    } catch (error) {
      done(error);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
