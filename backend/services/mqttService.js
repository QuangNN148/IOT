// Service quản lý MQTT connection và xử lý messages
const mqtt = require('mqtt');
const sensorModel = require('../models/sensorModel');
const actionModel = require('../models/actionModel');
const { emitSensorData, emitActionUpdate } = require('./socketService');
require('dotenv').config();

let mqttClient = null;
const pendingControls = new Map(); // Lưu các lệnh điều khiển đang chờ xác nhận

// Mapping LED sang tên thiết bị
const deviceMapping = {
  'led1': 'Light',
  'led2': 'Fan',
  'led3': 'Air condition'
};

// Khởi tạo MQTT client
const initMQTT = () => {
  const options = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    rejectUnauthorized: false // Bỏ qua SSL certificate validation
  };

  mqttClient = mqtt.connect(
    `mqtts://${process.env.MQTT_SERVER}:${process.env.MQTT_PORT}`,
    options
  );

  mqttClient.on('connect', () => {
    console.log('✅ MQTT đã kết nối thành công');
    
    // Subscribe các topics
    mqttClient.subscribe('sensors/data', (err) => {
      if (err) console.error('❌ Lỗi subscribe sensors/data:', err);
      else console.log('📡 Đã subscribe: sensors/data');
    });

    mqttClient.subscribe('Status/led1', (err) => {
      if (err) console.error('❌ Lỗi subscribe Status/led1:', err);
      else console.log('📡 Đã subscribe: Status/led1');
    });

    mqttClient.subscribe('Status/led2', (err) => {
      if (err) console.error('❌ Lỗi subscribe Status/led2:', err);
      else console.log('📡 Đã subscribe: Status/led2');
    });

    mqttClient.subscribe('Status/led3', (err) => {
      if (err) console.error('❌ Lỗi subscribe Status/led3:', err);
      else console.log('📡 Đã subscribe: Status/led3');
    });

    // Subscribe topic để ESP32 request trạng thái khi reconnect
    mqttClient.subscribe('Request/state', (err) => {
      if (err) console.error('❌ Lỗi subscribe Request/state:', err);
      else console.log('📡 Đã subscribe: Request/state');
    });
  });

  mqttClient.on('error', (error) => {
    console.error('❌ MQTT error:', error);
  });

  mqttClient.on('message', async (topic, message) => {
    try {
      const messageStr = message.toString();

      // Xử lý dữ liệu cảm biến
      if (topic === 'sensors/data') {
        const [temp, hum, light] = messageStr.split(',').map(Number);
        
        // Validate dữ liệu
        if (isNaN(temp) || isNaN(hum) || isNaN(light)) {
          console.error('❌ Dữ liệu cảm biến không hợp lệ:', messageStr);
          return;
        }

        // Lưu vào database
        await sensorModel.insertSensorData(temp, hum, light);
        
        // Emit qua Socket.IO
        const sensorData = {
          temperature: temp,
          humidity: hum,
          light: light,
          timestamp: new Date()
        };
        emitSensorData(sensorData);
        
        console.log(`📊 Sensor: Temp=${temp}°C, Hum=${hum}%, Light=${light} Lux`);
      }

      // Xử lý ESP32 request trạng thái khi reconnect
      else if (topic === 'Request/state') {
        console.log('🔄 ESP32 yêu cầu trạng thái thiết bị...');
        
        // Lấy trạng thái cuối cùng của tất cả thiết bị
        try {
          const states = {
            led1: await actionModel.getDeviceState('Light') || 'OFF',
            led2: await actionModel.getDeviceState('Fan') || 'OFF',
            led3: await actionModel.getDeviceState('Air condition') || 'OFF'
          };
          
          // Publish trạng thái về cho ESP32
          const stateMessage = `${states.led1},${states.led2},${states.led3}`;
          mqttClient.publish('Response/state', stateMessage);
          console.log(`📤 Đã gửi trạng thái về ESP32: ${stateMessage}`);
        } catch (error) {
          console.error('❌ Lỗi lấy trạng thái thiết bị:', error);
        }
      }

      // Xử lý trạng thái LED
      else if (topic.startsWith('Status/led')) {
        const ledNumber = topic.split('/')[1]; // led1, led2, led3
        const status = messageStr.toUpperCase(); // ON hoặc OFF
        const device = deviceMapping[ledNumber];
        const action = status === 'ON' ? 'on' : 'off';

        // Kiểm tra xem có lệnh điều khiển đang chờ không
        if (pendingControls.has(ledNumber)) {
          const { resolve } = pendingControls.get(ledNumber);
          pendingControls.delete(ledNumber);
          
          // Lưu vào database
          await actionModel.insertAction(device, action);
          
          // Emit qua Socket.IO
          const actionData = {
            device: device,
            action: action,
            timestamp: new Date()
          };
          emitActionUpdate(actionData);
          
          console.log(`💡 ${device} (${ledNumber}): ${status}`);
          
          // Resolve promise
          resolve({ success: true, device, action });
        } else {
          // Trường hợp nhận status không mong đợi (có thể do ESP32 gửi spontaneous)
          console.log(`ℹ️ Nhận status không mong đợi từ ${ledNumber}: ${status}`);
        }
      }
    } catch (error) {
      console.error('❌ Lỗi xử lý MQTT message:', error.message);
    }
  });

  return mqttClient;
};

// Điều khiển LED với Promise và timeout
const controlDevice = (device, action) => {
  return new Promise((resolve, reject) => {
    if (!mqttClient || !mqttClient.connected) {
      return reject(new Error('MQTT chưa kết nối'));
    }

    // Tạo lệnh điều khiển (onled1, offled1, ...)
    const command = `${action}${device}`;
    
    // Publish lệnh điều khiển
    mqttClient.publish('Control/led', command, (err) => {
      if (err) {
        return reject(new Error('Lỗi publish lệnh điều khiển'));
      }
      console.log(`📤 Đã gửi lệnh: ${command}`);
    });

    // Lưu promise resolver vào map để chờ xác nhận
    pendingControls.set(device, { resolve, reject });

    // Timeout sau 10 giây
    setTimeout(() => {
      if (pendingControls.has(device)) {
        pendingControls.delete(device);
        reject(new Error('Timeout: Không nhận được phản hồi từ ESP32 sau 10 giây'));
      }
    }, 10000);
  });
};

// Lấy MQTT client instance
const getMQTTClient = () => {
  return mqttClient;
};

module.exports = {
  initMQTT,
  controlDevice,
  getMQTTClient
};
