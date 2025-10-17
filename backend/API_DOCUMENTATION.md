# IoT Project API Documentation

## Base URL
```
http://localhost:5000/api
```

## Response Format
Tất cả API responses đều có format:
```json
{
  "success": true/false,
  "data": {...},
  "message": "optional error message"
}
```

---

## 1. Sensor APIs

### 1.1 Get Latest Sensor Data
Lấy dữ liệu sensor mới nhất (nhiệt độ, độ ẩm, ánh sáng)

**Endpoint:** `GET /sensors/latest`

**Response Success:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "temperature": 27.5,
    "humidity": 65.2,
    "light": 450,
    "timestamp": "2025-10-16T10:30:00.000Z"
  }
}
```

---

### 1.2 Get Sensor History
Lấy lịch sử dữ liệu sensor với các bộ lọc

**Endpoint:** `GET /sensors/history`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Tìm kiếm theo từ khóa |
| dataType | string | No | Lọc theo loại: `all`, `temp`, `hum`, `light`, `time` |
| sortBy | string | No | Sắp xếp: `timestamp`, `temperature`, `humidity`, `light` |
| sortOrder | string | No | Thứ tự: `ASC`, `DESC` (default: `DESC`) |
| limit | number | No | Số lượng records (default: 100) |

**Example Request:**
```
GET /sensors/history?dataType=temp&sortBy=temperature&sortOrder=DESC&limit=50
```

**Response Success:**
```json
{
  "success": true,
  "data": [
    {
      "id": 100,
      "temperature": 28.5,
      "humidity": 67.3,
      "light": 520,
      "timestamp": "2025-10-16T10:30:00.000Z"
    },
    {
      "id": 99,
      "temperature": 27.8,
      "humidity": 66.1,
      "light": 510,
      "timestamp": "2025-10-16T10:29:00.000Z"
    }
  ]
}
```

---

## 2. Action History APIs

### 2.1 Get Action History
Lấy lịch sử điều khiển thiết bị với các bộ lọc

**Endpoint:** `GET /actions/history`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Tìm kiếm theo từ khóa |
| dataType | string | No | Lọc theo loại: `all`, `device`, `action`, `time` |
| deviceFilter | string | No | Lọc thiết bị: `all`, `Light`, `Fan`, `Air condition` |
| actionFilter | string | No | Lọc trạng thái: `all`, `ON`, `OFF` |
| sortBy | string | No | Sắp xếp: `created_at`, `device`, `action` |
| sortOrder | string | No | Thứ tự: `ASC`, `DESC` (default: `DESC`) |
| limit | number | No | Số lượng records (default: 100) |

**Example Request:**
```
GET /actions/history?deviceFilter=Light&actionFilter=ON&limit=20
```

**Response Success:**
```json
{
  "success": true,
  "data": [
    {
      "id": 50,
      "device": "Light",
      "action": "on",
      "created_at": "2025-10-16T10:30:00.000Z"
    },
    {
      "id": 48,
      "device": "Light",
      "action": "on",
      "created_at": "2025-10-16T10:25:00.000Z"
    }
  ]
}
```

---

### 2.2 Get Latest Actions
Lấy trạng thái mới nhất của tất cả thiết bị

**Endpoint:** `GET /actions/latest`

**Response Success:**
```json
{
  "success": true,
  "data": [
    {
      "device": "Light",
      "action": "on",
      "created_at": "2025-10-16T10:30:00.000Z"
    },
    {
      "device": "Fan",
      "action": "off",
      "created_at": "2025-10-16T10:28:00.000Z"
    },
    {
      "device": "Air condition",
      "action": "on",
      "created_at": "2025-10-16T10:25:00.000Z"
    }
  ]
}
```

---

### 2.3 Get Device State
Lấy trạng thái hiện tại của một thiết bị cụ thể

**Endpoint:** `GET /actions/state/:device`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| device | string | Yes | Tên thiết bị: `Light`, `Fan`, `Air condition` |

**Example Request:**
```
GET /actions/state/Light
```

**Response Success:**
```json
{
  "success": true,
  "data": {
    "device": "Light",
    "action": "on",
    "created_at": "2025-10-16T10:30:00.000Z"
  }
}
```

**Response Not Found:**
```json
{
  "success": true,
  "data": null,
  "message": "No state found for device"
}
```

---

## 3. Device Control API

### 3.1 Control Device
Điều khiển bật/tắt thiết bị (LED)

**Endpoint:** `POST /control`

**Request Body:**
```json
{
  "device": "led1",
  "action": "on"
}
```

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| device | string | Yes | Thiết bị: `led1` (Light), `led2` (Fan), `led3` (Air condition) |
| action | string | Yes | Hành động: `on`, `off` |

**Response Success:**
```json
{
  "success": true,
  "message": "Device led1 turned on successfully",
  "data": {
    "device": "led1",
    "action": "on",
    "timestamp": "2025-10-16T10:30:00.000Z"
  }
}
```

**Response Error (Invalid Device):**
```json
{
  "success": false,
  "message": "Invalid device. Use led1, led2, or led3"
}
```

**Response Error (Invalid Action):**
```json
{
  "success": false,
  "message": "Invalid action. Use on or off"
}
```

**Response Error (Control Failed):**
```json
{
  "success": false,
  "message": "Failed to control device. Please try again."
}
```

---

## 4. Profile API

### 4.1 Get Profile
Lấy thông tin sinh viên và các links

**Endpoint:** `GET /profile`

**Response Success:**
```json
{
  "success": true,
  "data": {
    "name": "Nguyễn Nhật Quang",
    "msv": "B22DCCN645",
    "class": "D22HTT05",
    "phone": "0936201378",
    "email": "nnq148@gmail.com",
    "links": {
      "docs": "https://docs.google.com/your-docs-link",
      "github": "https://github.com/nnq148",
      "figma": "https://figma.com/your-figma-link",
      "postman": "https://postman.com/your-collection-link",
      "diagram": "https://draw.io/your-diagram-link"
    }
  }
}
```

---

## 5. Real-time Events (Socket.IO)

### Connection
```javascript
const socket = io('http://localhost:5000');
```

### Events

#### 5.1 sensor-data
Nhận dữ liệu sensor realtime từ ESP32

**Event Name:** `sensor-data`

**Data Format:**
```json
{
  "temperature": 27.5,
  "humidity": 65.2,
  "light": 450,
  "timestamp": "2025-10-16T10:30:00.000Z"
}
```

**Client Code:**
```javascript
socket.on('sensor-data', (data) => {
  console.log('Sensor data:', data);
});
```

---

#### 5.2 action-update
Nhận thông báo khi có thiết bị được điều khiển

**Event Name:** `action-update`

**Data Format:**
```json
{
  "device": "Light",
  "action": "on",
  "timestamp": "2025-10-16T10:30:00.000Z"
}
```

**Client Code:**
```javascript
socket.on('action-update', (data) => {
  console.log('Device action:', data);
});
```

---

#### 5.3 device-status
Nhận phản hồi trạng thái thiết bị từ ESP32

**Event Name:** `device-status`

**Data Format:**
```json
{
  "device": "led1",
  "status": "on",
  "timestamp": "2025-10-16T10:30:00.000Z"
}
```

**Client Code:**
```javascript
socket.on('device-status', (data) => {
  console.log('Device status:', data);
});
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Device Mapping

| Frontend ID | Device Name | MQTT Topic | ESP32 Pin |
|-------------|-------------|------------|-----------|
| led1 | Light | IoT/Control/led1 | GPIO_X |
| led2 | Fan | IoT/Control/led2 | GPIO_Y |
| led3 | Air condition | IoT/Control/led3 | GPIO_Z |

---

## MQTT Topics

### Publish (Backend → ESP32)
- `IoT/Control/led1` - Control Light
- `IoT/Control/led2` - Control Fan
- `IoT/Control/led3` - Control Air condition
- `IoT/Request/state` - Request device state restore

### Subscribe (ESP32 → Backend)
- `IoT/Sensor/data` - Sensor data (temp, humidity, light)
- `IoT/Status/led1` - Light status feedback
- `IoT/Status/led2` - Fan status feedback
- `IoT/Status/led3` - Air condition status feedback
- `IoT/Response/state` - Device state response

---

## Testing with Postman

1. Import collection từ file `postman_collection.json`
2. Set environment variable `base_url` = `http://localhost:5000/api`
3. Test từng endpoint theo thứ tự:
   - Profile (không cần params)
   - Sensors Latest
   - Sensors History (với filters)
   - Actions Latest
   - Actions History (với filters)
   - Device State
   - Control Device (POST với body)

---

## Notes

- Tất cả timestamps sử dụng ISO 8601 format
- Database timezone: UTC
- Frontend hiển thị timezone: Local (vi-VN)
- MQTT broker: HiveMQ Cloud
- WebSocket port: 5000 (cùng với HTTP server)
