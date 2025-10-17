// Service quản lý Socket.IO cho realtime communication
const socketIO = require('socket.io');

let io = null;

// Khởi tạo Socket.IO server
const initSocketIO = (server) => {
  io = socketIO(server, {
    cors: {
      origin: '*', // Cho phép tất cả origins (có thể giới hạn trong production)
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('✅ Client đã kết nối Socket.IO:', socket.id);

    socket.on('disconnect', () => {
      console.log('❌ Client đã ngắt kết nối:', socket.id);
    });
  });

  return io;
};

// Emit dữ liệu cảm biến tới tất cả clients
const emitSensorData = (data) => {
  if (io) {
    io.emit('sensorData', data);
    console.log('📡 Đã emit sensorData:', data);
  }
};

// Emit cập nhật hành động tới tất cả clients
const emitActionUpdate = (data) => {
  if (io) {
    io.emit('actionUpdate', data);
    console.log('📡 Đã emit actionUpdate:', data);
  }
};

// Lấy instance của io
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO chưa được khởi tạo');
  }
  return io;
};

module.exports = {
  initSocketIO,
  emitSensorData,
  emitActionUpdate,
  getIO
};
