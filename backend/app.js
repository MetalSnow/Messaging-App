const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.json({ message: 'Messaging App Server' });
});

app.use(authRouter);
app.use(profileRouter);
app.use(friendsRouter);
app.use(messagesRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Messaging App is listening on port:${PORT}`),
);
