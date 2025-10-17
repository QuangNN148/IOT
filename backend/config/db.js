// Cấu hình kết nối MySQL với pool connection
const mysql = require('mysql2/promise');
require('dotenv').config();

// Tạo connection pool cho hiệu suất tốt hơn
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Script SQL để tạo bảng
const createTables = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Tạo bảng sensors_data
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sensors_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        temperature DECIMAL(5,2) NOT NULL COMMENT 'Nhiệt độ (°C)',
        humidity DECIMAL(5,2) NOT NULL COMMENT 'Độ ẩm (%)',
        light INT NOT NULL COMMENT 'Ánh sáng (Lux)',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_created_at (created_at DESC),
        INDEX idx_temp_humidity (temperature, humidity),
        INDEX idx_light (light)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tạo bảng action_history
    await connection.query(`
      CREATE TABLE IF NOT EXISTS action_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        device VARCHAR(50) NOT NULL COMMENT 'Tên thiết bị (Light, Fan, Air condition)',
        action VARCHAR(10) NOT NULL COMMENT 'Hành động (on/off)',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_created_at (created_at DESC),
        INDEX idx_device (device),
        INDEX idx_action (action),
        INDEX idx_device_action (device, action)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('✅ Bảng database đã được tạo thành công');
    connection.release();
  } catch (error) {
    console.error('❌ Lỗi khi tạo bảng:', error.message);
    throw error;
  }
};

// Kiểm tra kết nối database
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Kết nối MySQL thành công');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Lỗi kết nối MySQL:', error.message);
    return false;
  }
};

module.exports = { pool, createTables, testConnection };
