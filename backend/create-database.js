// Script tự động tạo database
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  try {
    // Kết nối MySQL không chỉ định database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    });

    console.log('✅ Kết nối MySQL thành công');

    // Tạo database
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`✅ Database '${process.env.DB_NAME}' đã được tạo thành công`);

    await connection.end();
    console.log('\n🎉 Hoàn tất! Bây giờ bạn có thể chạy: node server.js');
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

createDatabase();
