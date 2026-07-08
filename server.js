// server.js
const express = require('express');
const next = require('next');
const { createServer } = require('http');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const expressApp = express();
  const server = createServer(expressApp);
  
  // Initialisation de Socket.io
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Gestion des connexions Sockets
  io.on('connection', (socket) => {
    console.log(`⚡ Client connecté : ${socket.id}`);

    // Rejoindre une "room" spécifique à l'utilisateur (basée sur son ID)
    socket.on('join_user_room', (userId) => {
      socket.join(userId);
      console.log(`👤 Utilisateur ${userId} a rejoint sa room privée.`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client déconnecté : ${socket.id}`);
    });
  });

  // Rendre 'io' accessible globalement dans l'application si nécessaire
  global.io = io;

  // Laisser Next.js gérer toutes les routes
expressApp.all(/.*/, (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});