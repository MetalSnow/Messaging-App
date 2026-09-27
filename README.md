# RippleChat — Messaging App

RippleChat is a full-stack real-time messaging application where users can connect with friends, send messages, share images, and see who's currently online.

The project was built to practice full-stack web development, authentication, database management, real-time communication, and deployment.

## Features

- 🔐 User registration and login
- 👤 User profiles
- 🖼️ Profile and cover images
- 👥 Add, accept, and manage friends
- 💬 Send and receive messages in real time
- 🖼️ Send image messages
- 🟢 See which friends are currently online
- ⚡ Real-time communication with Socket.IO
- 🌙 Light and dark themes
- 🔔 Image selection notification badge
- 🔒 Session-based authentication
- 🚪 Secure logout

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Context API
- CSS Modules
- Lucide React

### Backend

- Node.js
- Express
- Passport.js
- Express Session
- Socket.IO

### Database & Storage

- PostgreSQL
- Prisma ORM
- Prisma Session Store
- Supabase Storage

### Deployment

- Vercel — Frontend
- Render — Backend
- Neon — PostgreSQL Database

## Project Structure

```text
Messaging-App/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── assets/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── prisma/
│   ├── public/
│   ├── app.js
│   └── package.json
│
└── README.md
```
