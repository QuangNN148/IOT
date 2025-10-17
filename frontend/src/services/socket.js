// Socket.IO client service
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socket = null;

// Kết nối Socket.IO
export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('✅ Socket.IO connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error);
    });
  }

  return socket;
};

// Ngắt kết nối Socket.IO
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Lắng nghe sự kiện sensor data
export const onSensorData = (callback) => {
  if (socket) {
    socket.on('sensorData', callback);
  }
};

// Hủy lắng nghe sự kiện sensor data
export const offSensorData = () => {
  if (socket) {
    socket.off('sensorData');
  }
};

// Lắng nghe sự kiện action update
export const onActionUpdate = (callback) => {
  if (socket) {
    socket.on('actionUpdate', callback);
  }
};

// Hủy lắng nghe sự kiện action update
export const offActionUpdate = () => {
  if (socket) {
    socket.off('actionUpdate');
  }
};

// Lấy socket instance
export const getSocket = () => socket;

export default {
  connectSocket,
  disconnectSocket,
  onSensorData,
  offSensorData,
  onActionUpdate,
  offActionUpdate,
  getSocket
};
