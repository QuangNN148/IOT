// IoT Backend Server - Node.js + Express + MySQL + MQTT + Socket.IO
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import services và config
const { testConnection, createTables } = require('./config/db');
const { initMQTT } = require('./services/mqttService');
const { initSocketIO } = require('./services/socketService');
const apiRoutes = require('./routes/api');

// Khởi tạo Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files từ thư mục public
app.use(express.static('public'));

// API Routes
app.use('/api', apiRoutes);

// Serve learn.yaml file
app.get('/learn.yaml', (req, res) => {
  res.sendFile(__dirname + '/learn.yaml');
});

// API Documentation route
app.get('/docs', (req, res) => {
  res.sendFile(__dirname + '/public/api-docs.html');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'IoT Backend Server is running',
    timestamp: new Date()
  });
});

// Khởi động server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('🚀 Đang khởi động IoT Backend Server...\n');

    // 1. Kiểm tra kết nối database
    console.log('📦 Kiểm tra kết nối MySQL...');
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Không thể kết nối MySQL');
    }

    // 2. Tạo bảng database nếu chưa có
    console.log('📦 Tạo bảng database...');
    await createTables();

    // 3. Khởi tạo Socket.IO
    console.log('🔌 Khởi tạo Socket.IO...');
    initSocketIO(server);

    // 4. Khởi tạo MQTT
    console.log('� Khởi tạo MQTT connection...');
    initMQTT();

    // 5. Start server
    server.listen(PORT, () => {
      console.log('\n✅ ========================================');
      console.log(`✅ IoT Backend Server đang chạy`);
      console.log(`✅ Port: ${PORT}`);
      console.log(`✅ URL: http://localhost:${PORT}`);
      console.log(`✅ Socket.IO: ws://localhost:${PORT}`);
      console.log('✅ ========================================\n');
    });

  } catch (error) {
    console.error('❌ Lỗi khởi động server:', error.message);
    process.exit(1);
  }
};

// Xử lý các sự kiện shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing server');
  server.close(() => {
    console.log('✅ Server đã đóng');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT signal received: closing server');
  server.close(() => {
    console.log('✅ Server đã đóng');
    process.exit(0);
  });
});

// Bắt đầu server
startServer();