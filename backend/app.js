const express = require('express');
const passport = require('./config/passport');
const session = require('express-session');
const errorHandler = require('./middlewares/errorHandler');
const userRouter = require('./routes/userRouter');
const profileRouter = require('./routes/profileRouter');
const friendsRouter = require('./routes/friendsRouter');
const messagesRouter = require('./routes/messagesRouter');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./config/prismaClient');
require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'lax',
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use(passport.session());

app.get('/', (req, res) => {
  res.json({ message: 'Messaging App Server' });
});

app.use(userRouter);
app.use(profileRouter);
app.use(friendsRouter);
app.use(messagesRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Messaging App is listening on port:${PORT}`),
);
