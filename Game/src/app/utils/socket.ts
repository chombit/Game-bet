import { io } from 'socket.io-client';

// In production, this would be an environment variable
const SOCKET_URL = 'http://localhost:3001';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  auth: {
    token: localStorage.getItem('auth_token')
  }
});

socket.on('connect', () => {
  console.log('Connected to Premium Crash Server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
