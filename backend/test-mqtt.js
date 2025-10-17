// Script test MQTT - mô phỏng ESP32 gửi dữ liệu
const mqtt = require('mqtt');
require('dotenv').config();

const options = {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  rejectUnauthorized: false
};

const client = mqtt.connect(
  `mqtts://${process.env.MQTT_SERVER}:${process.env.MQTT_PORT}`,
  options
);

client.on('connect', () => {
  console.log('✅ Test MQTT client đã kết nối');
  
  // Subscribe để nhận lệnh điều khiển
  client.subscribe('Control/led', (err) => {
    if (!err) console.log('📡 Đã subscribe: Control/led');
  });

  // Gửi dữ liệu cảm biến giả lập mỗi 3 giây
  let temp = 25;
  let hum = 60;
  let light = 500;
  
  setInterval(() => {
    // Random data
    temp = (25 + Math.random() * 5).toFixed(2);
    hum = (60 + Math.random() * 10).toFixed(2);
    light = Math.floor(500 + Math.random() * 200);
    
    const data = `${temp},${hum},${light}`;
    client.publish('sensors/data', data);
    console.log(`📤 Đã gửi dữ liệu: ${data}`);
  }, 3000);
});

client.on('message', (topic, message) => {
  console.log(`📬 Nhận message từ topic: ${topic}, nội dung: ${message.toString()}`);
  
  if (topic === 'Control/led') {
    const command = message.toString();
    console.log(`📥 Nhận lệnh điều khiển: ${command}`);
    
    // Parse command (onled1, offled2, ...)
    const action = command.substring(0, 2); // "on" hoặc "off"
    const led = command.substring(2); // "led1", "led2", "led3"
    const status = action === 'on' ? 'ON' : 'OFF';
    
    // Gửi xác nhận status
    setTimeout(() => {
      client.publish(`Status/${led}`, status);
      console.log(`✅ Đã gửi xác nhận: Status/${led} = ${status}`);
    }, 500);
  }
});

client.on('error', (error) => {
  console.error('❌ MQTT error:', error);
});

console.log('🚀 Đang khởi động test MQTT client...');
console.log('⚡ Script này sẽ mô phỏng ESP32 gửi dữ liệu cảm biến và nhận lệnh điều khiển');
console.log('⚡ Nhấn Ctrl+C để dừng\n');
