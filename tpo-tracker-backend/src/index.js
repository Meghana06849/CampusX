import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import app, { dbConnectionPromise } from './app.js';
import setupSocketIO from './socket/socketHandler.js';
import { setRealtimeEmitter } from './socket/realtime.js';

dotenv.config();
const server = http.createServer(app);
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
];

// Initialize Socket.IO
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

setupSocketIO(io);
setRealtimeEmitter((eventName, payload) => io.emit(eventName, payload));

// Start server only after MongoDB is ready so the first request does not hit buffering timeouts.
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await dbConnectionPromise;

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
