import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import app from './app.js';
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

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
