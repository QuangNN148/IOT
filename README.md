# IoT Monitoring and Control System

Hệ thống IoT theo dõi và điều khiển các thiết bị thông minh sử dụng ESP32, MQTT, MySQL, Node.js và ReactJS.

## 📋 Mô tả dự án

Dự án IoT Dashboard giúp theo dõi dữ liệu cảm biến (nhiệt độ, độ ẩm, ánh sáng) và điều khiển các thiết bị (Đèn, Quạt, Điều hòa) thông qua giao diện web hiện đại với khả năng cập nhật realtime.

### Tính năng chính:
- ✅ Theo dõi dữ liệu cảm biến realtime (DHT11 + Quang trở)
- ✅ Điều khiển 3 LED (Đèn, Quạt, Điều hòa) qua giao diện web
- ✅ Biểu đồ realtime với Recharts
- ✅ Lưu trữ dữ liệu vào MySQL
- ✅ Socket.IO cho cập nhật realtime
- ✅ MQTT protocol để giao tiếp với ESP32
- ✅ Backend chờ phản hồi từ hardware trước khi lưu vào database
- ✅ 4 trang: Dashboard, Data Sensors, Action History, Profile

## 🛠️ Công nghệ sử dụng

### Backend:
- Node.js + Express.js
- MySQL (mysql2)
- MQTT (mqtt)
- Socket.IO
- dotenv, cors, body-parser

### Frontend:
- ReactJS (Hooks)
- React Router DOM
- Axios
- Socket.IO Client
- Recharts
- TailwindCSS

### Hardware:
- ESP32
- DHT11 (nhiệt độ, độ ẩm)
- Quang trở (ánh sáng)
- 3 LED

## 📁 Cấu trúc dự án

```
iot-project/
├── backend/
│   ├── config/
│   │   └── db.js                 # Kết nối MySQL
│   ├── controllers/
│   │   ├── sensorController.js   # API sensor data
│   │   ├── actionController.js   # API action history
│   │   └── controlController.js  # API điều khiển
│   ├── models/
│   │   ├── sensorModel.js        # Model sensors_data
│   │   └── actionModel.js        # Model action_history
│   ├── routes/
│   │   └── api.js                # Routes definition
│   ├── services/
│   │   ├── mqttService.js        # MQTT client
│   │   └── socketService.js      # Socket.IO server
│   ├── .env                      # Environment variables
│   ├── server.js                 # Entry point
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx       # Menu điều hướng
│   │   │   ├── SensorCard.jsx    # Card hiển thị cảm biến
│   │   │   ├── DeviceToggle.jsx  # Toggle điều khiển
│   │   │   └── DataTable.jsx     # Bảng dữ liệu
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Dashboard
│   │   │   ├── DataSensors.jsx   # Lịch sử sensor
│   │   │   ├── ActionHistory.jsx # Lịch sử hành động
│   │   │   └── Profile.jsx       # Thông tin cá nhân
│   │   ├── services/
│   │   │   ├── api.js            # API wrapper
│   │   │   └── socket.js         # Socket.IO client
│   │   ├── App.js                # Router
│   │   ├── index.js              # Entry point
│   │   └── index.css             # Global styles
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

## 🚀 Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống

- Node.js >= 16.x
- MySQL >= 8.0
- ESP32 với code đã được nạp
- HiveMQ Cloud account (hoặc MQTT broker khác)

### 2. Cài đặt Backend

```powershell
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env (đã có sẵn, chỉnh sửa nếu cần)
# Cập nhật thông tin MySQL của bạn trong file .env
```

**Cấu hình file `.env`:**
```env
PORT=5000

# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=          # Nhập password MySQL của bạn
DB_NAME=iotdb

# MQTT Configuration
MQTT_SERVER=f12034700b2d452b8de9508ddec28f11.s1.eu.hivemq.cloud
MQTT_PORT=8883
MQTT_USERNAME=nnq148
MQTT_PASSWORD=Quang2004
```

### 3. Cài đặt MySQL Database

```sql
-- Tạo database
CREATE DATABASE IF NOT EXISTS iotdb;
USE iotdb;

-- Bảng sẽ được tự động tạo khi chạy backend lần đầu
-- Hoặc chạy thủ công:

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
```

### 4. Cài đặt Frontend

```powershell
# Di chuyển vào thư mục frontend
cd ../frontend

# Cài đặt dependencies
npm install
```

### 5. Chạy ứng dụng

#### Chạy Backend:
```powershell
cd backend
npm start
# hoặc dùng nodemon cho development:
npm run dev
```

Backend sẽ chạy tại: `http://localhost:5000`

#### Chạy Frontend:
```powershell
cd frontend
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 📡 MQTT Topics

### Subscribe (Backend nhận):
- `sensors/data` - Dữ liệu cảm biến (format: "temp,hum,light")
- `Status/led1` - Trạng thái đèn ("ON"/"OFF")
- `Status/led2` - Trạng thái quạt ("ON"/"OFF")
- `Status/led3` - Trạng thái điều hòa ("ON"/"OFF")

### Publish (Backend gửi):
- `Control/led` - Lệnh điều khiển (format: "onled1", "offled2", ...)

## 🔌 API Endpoints

### Sensor APIs:
- `GET /api/sensors/latest` - Lấy dữ liệu cảm biến mới nhất
- `GET /api/sensors/history?from=&to=&search=` - Lịch sử dữ liệu cảm biến

### Action APIs:
- `GET /api/actions/history?from=&to=&search=` - Lịch sử hành động
- `GET /api/actions/latest` - Hành động mới nhất của mỗi thiết bị

### Control API:
- `POST /api/control` - Điều khiển thiết bị
  ```json
  {
    "device": "led1",  // led1, led2, led3
    "action": "on"     // on, off
  }
  ```

### Profile API:
- `GET /api/profile` - Thông tin sinh viên

## 🎨 Giao diện

### 1. Dashboard (Home)
- 3 card hiển thị nhiệt độ, độ ẩm, ánh sáng
- Biểu đồ realtime với 10 điểm dữ liệu gần nhất
- 3 toggle switch điều khiển thiết bị

### 2. Data Sensors
- Bảng lịch sử dữ liệu cảm biến
- Filter theo ngày, tìm kiếm
- Phân trang

### 3. Action History
- Bảng lịch sử hành động
- Cập nhật realtime
- Filter và tìm kiếm

### 4. Profile
- Thông tin sinh viên
- Liên kết tài liệu (Docs, GitHub, Figma, Diagram)

## ⚙️ Cách hoạt động

1. **ESP32** đọc dữ liệu từ DHT11 và quang trở, gửi lên topic `sensors/data` qua MQTT
2. **Backend** nhận dữ liệu, lưu vào MySQL, emit qua Socket.IO
3. **Frontend** nhận dữ liệu realtime từ Socket.IO, cập nhật UI
4. Khi user bật/tắt thiết bị:
   - Frontend gọi API `POST /api/control`
   - Backend publish lệnh lên topic `Control/led`
   - ESP32 nhận lệnh, thực hiện, gửi trạng thái lên topic `Status/ledX`
   - Backend nhận xác nhận (trong 10s), lưu vào database, emit qua Socket.IO
   - Frontend cập nhật trạng thái thiết bị

## 🔧 Troubleshooting

### Backend không kết nối được MySQL:
- Kiểm tra MySQL đã chạy: `mysql -u root -p`
- Kiểm tra thông tin trong file `.env`
- Tạo database: `CREATE DATABASE iotdb;`

### Backend không kết nối được MQTT:
- Kiểm tra credentials trong `.env`
- Kiểm tra ESP32 đã kết nối WiFi
- Test MQTT broker với MQTT Explorer

### Frontend không nhận được dữ liệu realtime:
- Kiểm tra backend đã chạy
- Mở Console để xem logs
- Kiểm tra Socket.IO connection

### ESP32 không gửi dữ liệu:
- Kiểm tra Serial Monitor
- Kiểm tra kết nối WiFi
- Kiểm tra kết nối MQTT broker

## 👨‍💻 Thông tin tác giả

- **Họ tên:** Nguyễn Nhật Quang
- **Mã SV:** B22DCCN645
- **Lớp:** D22HTT05
- **SĐT:** 0936201378
- **Email:** nnq148@gmail.com

## 📝 License

ISC License - Free to use for educational purposes.

## 🙏 Lưu ý

- Đảm bảo ESP32 đã được nạp code và kết nối WiFi
- MQTT broker (HiveMQ Cloud) cần có internet
- MySQL phải được cài đặt và chạy
- Port 5000 và 3000 phải available

---

**Happy Coding! 🚀**
