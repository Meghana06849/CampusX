import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const SOCKET_ENABLED = import.meta.env.VITE_ENABLE_SOCKET === 'true';

export class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!SOCKET_ENABLED) {
      return null;
    }

    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  joinRoom(roomId) {
    this.emit('joinRoom', roomId);
  }

  leaveRoom(roomId) {
    this.emit('leaveRoom', roomId);
  }
}

export const socketService = new SocketService();
export default socketService;
