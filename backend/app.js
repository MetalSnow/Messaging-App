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
const authRouter = require('./routes/authRouter');
const cors = require('cors');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});
app.set('io', io);

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  }),
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'));

const isProd = process.env.NODE_ENV === 'production';

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
  },

  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, //ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});

app.use(sessionMiddleware);

app.use(passport.session());

app.get('/', (req, res) => {
  res.json({ message: 'Messaging App Server' });
});

app.use(authRouter);
app.use(userRouter);
app.use(profileRouter);
app.use(friendsRouter);
app.use(messagesRouter);

app.use(errorHandler);

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.session()));

const onlineUsers = new Map();

io.on('connection', (socket) => {
  if (!socket.request.user) return;

  const userId = socket.request.user.id;
  onlineUsers.set(userId, socket.id);

  socket.on('disconnect', () => {
    onlineUsers.delete(userId);
  });
});

app.set('onlineUsers', onlineUsers);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Messaging App is listening on port:${PORT}`),
);
