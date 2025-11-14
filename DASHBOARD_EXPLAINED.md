# 📊 Dashboard - Giải Thích Chi Tiết

## 📋 Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [Kiến Trúc Hệ Thống](#kiến-trúc-hệ-thống)
3. [Luồng Hoạt Động](#luồng-hoạt-động)
4. [Chi Tiết Backend](#chi-tiết-backend)
5. [Chi Tiết Frontend](#chi-tiết-frontend)
6. [Cách Tạo Dashboard](#cách-tạo-dashboard)

---

## 🎯 Tổng Quan

Dashboard là trang thống kê mới với **2 bảng chính**:

### 1️⃣ Bảng Thống Kê Vượt Ngưỡng Cảm Biến
- Hiển thị số lần mỗi cảm biến (nhiệt độ, độ ẩm, ánh sáng) vượt qua ngưỡng đã cài đặt
- Cho phép người dùng **tùy chỉnh ngưỡng** cho từng loại cảm biến
- Lưu cài đặt ngưỡng vào **localStorage** để giữ nguyên khi chuyển trang

### 2️⃣ Bảng Thống Kê Bật/Tắt Thiết Bị
- Hiển thị số lượt bật/tắt của từng thiết bị trong một ngày cụ thể
- Cho phép chọn ngày để xem thống kê
- Sắp xếp giảm dần theo số lượt (thiết bị hoạt động nhiều nhất → ít nhất)

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────────┐
│                        DASHBOARD                             │
│                                                              │
│  ┌──────────────────┐          ┌──────────────────┐        │
│  │   Frontend       │  HTTP    │    Backend       │        │
│  │   React.js       │ ◄──────► │    Node.js       │        │
│  │  (Dashboard.jsx) │          │ (dashboardCtrl)  │        │
│  └──────────────────┘          └──────────────────┘        │
│          │                              │                   │
│          │                              │                   │
│          ▼                              ▼                   │
│  ┌──────────────────┐          ┌──────────────────┐        │
│  │  localStorage    │          │   MySQL DB       │        │
│  │  (thresholds)    │          │  (sensors_data   │        │
│  └──────────────────┘          │   action_history)│        │
│                                 └──────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Luồng Hoạt Động

### 📊 Luồng 1: Thống Kê Vượt Ngưỡng Cảm Biến

```
┌─────────────┐
│  User mở    │
│  Dashboard  │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  1. Component Dashboard.jsx mount                        │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  2. Load thresholds từ localStorage                      │
│     - Nếu có: dùng giá trị đã lưu                       │
│     - Nếu không: dùng default (30°C, 80%, 700 lux)      │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  3. useEffect kích hoạt → gọi loadSensorStats()          │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  4. API Call: GET /api/dashboard/sensor-threshold-stats  │
│     Query params:                                         │
│     - tempThreshold=30                                    │
│     - humidityThreshold=80                                │
│     - lightThreshold=700                                  │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  5. Backend nhận request                                  │
│     → dashboardController.getSensorThresholdStats()       │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  6. Query MySQL database (sensors_data table)             │
│     SELECT:                                               │
│     - COUNT số lần temperature > 30                       │
│     - COUNT số lần humidity > 80                          │
│     - COUNT số lần light > 700                            │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  7. Backend trả về JSON response                          │
│     {                                                     │
│       "success": true,                                    │
│       "data": {                                           │
│         "temperature": {                                  │
│           "threshold": 30,                                │
│           "exceeded_count": 0                             │
│         },                                                │
│         "humidity": { ... },                              │
│         "light": { ... }                                  │
│       }                                                   │
│     }                                                     │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  8. Frontend nhận response                                │
│     → setState(sensorStats)                               │
│     → setLoading(false)                                   │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  9. React re-render → Hiển thị bảng thống kê             │
│     3 rows: Temperature, Humidity, Light                  │
└───────────────────────────────────────────────────────────┘
```

### ⚙️ Luồng 2: Cài Đặt Ngưỡng Mới

```
┌─────────────┐
│  User click │
│  "⚙️ Cài đặt"│
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  1. setIsEditingThresholds(true)                         │
│     → Hiển thị form input 3 trường                       │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  2. User nhập giá trị mới                                 │
│     - Temperature: 25°C                                   │
│     - Humidity: 70%                                       │
│     - Light: 500 lux                                      │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  3. User click "✅ Lưu"                                   │
│     → handleSaveThresholds()                              │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  4. Lưu vào state: setThresholds(newValues)               │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  5. Lưu vào localStorage:                                 │
│     localStorage.setItem('sensorThresholds', JSON)        │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  6. useEffect phát hiện thresholds thay đổi               │
│     → Tự động gọi lại API với ngưỡng mới                 │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  7. Backend query lại với ngưỡng mới                      │
│     COUNT temperature > 25 (thay vì 30)                   │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  8. Hiển thị kết quả mới trên bảng                        │
└───────────────────────────────────────────────────────────┘
```

### 🔄 Luồng 3: Thống Kê Bật/Tắt Thiết Bị

```
┌─────────────┐
│  User chọn  │
│    ngày     │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  1. onChange event → setSelectedDate('2025-11-07')        │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  2. useEffect phát hiện selectedDate thay đổi             │
│     → gọi loadDeviceStats()                               │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  3. API Call: GET /api/dashboard/device-toggle-stats     │
│     Query param: ?date=2025-11-07                         │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  4. Backend → dashboardController.getDeviceToggleStats()  │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  5. Query MySQL (action_history table)                    │
│     SELECT device, COUNT(*) as toggle_count               │
│     FROM action_history                                   │
│     WHERE DATE(created_at) = '2025-11-07'                 │
│     GROUP BY device                                       │
│     ORDER BY toggle_count DESC                            │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  6. Backend trả về JSON response                          │
│     {                                                     │
│       "success": true,                                    │
│       "data": [                                           │
│         {                                                 │
│           "device": "Light",                              │
│           "toggle_count": 25,                             │
│           "on_count": 13,                                 │
│           "off_count": 12                                 │
│         },                                                │
│         { "device": "Fan", ... },                         │
│         { "device": "Air condition", ... }                │
│       ]                                                   │
│     }                                                     │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  7. Frontend nhận response → setState(deviceStats)        │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  8. Render bảng với các thiết bị đã sắp xếp              │
│     (Nhiều nhất → Ít nhất)                               │
└───────────────────────────────────────────────────────────┘
```

---

## 🔧 Chi Tiết Backend

### File: `backend/controllers/dashboardController.js`

#### 1. Import Dependencies

```javascript
const { pool } = require('../config/db');
```
- Import `pool` từ config/db.js để kết nối MySQL
- `pool` là connection pool của mysql2/promise

#### 2. API #1: getSensorThresholdStats

**Endpoint:** `GET /api/dashboard/sensor-threshold-stats`

**Query Parameters:**
- `tempThreshold` (optional, default: 30)
- `humidityThreshold` (optional, default: 80)
- `lightThreshold` (optional, default: 700)

**SQL Query:**
```sql
SELECT 
  COUNT(CASE WHEN temperature > ? THEN 1 END) as temp_exceeded_count,
  COUNT(CASE WHEN humidity > ? THEN 1 END) as humidity_exceeded_count,
  COUNT(CASE WHEN light > ? THEN 1 END) as light_exceeded_count
FROM sensors_data
```

**Giải thích SQL:**
- `COUNT(CASE WHEN ... THEN 1 END)`: Đếm số dòng thỏa điều kiện
- `temperature > ?`: Placeholder cho giá trị ngưỡng (prepared statement)
- Trả về 1 row với 3 cột: số lần vượt ngưỡng của mỗi cảm biến

**Response Format:**
```json
{
  "success": true,
  "data": {
    "temperature": {
      "threshold": 30,
      "exceeded_count": 0
    },
    "humidity": {
      "threshold": 80,
      "exceeded_count": 56
    },
    "light": {
      "threshold": 700,
      "exceeded_count": 42
    }
  }
}
```

#### 3. API #2: getDeviceToggleStats

**Endpoint:** `GET /api/dashboard/device-toggle-stats`

**Query Parameters:**
- `date` (optional, format: YYYY-MM-DD, default: today)

**SQL Query:**
```sql
SELECT 
  device,
  COUNT(*) as toggle_count,
  SUM(CASE WHEN action = 'on' THEN 1 ELSE 0 END) as on_count,
  SUM(CASE WHEN action = 'off' THEN 1 ELSE 0 END) as off_count,
  MAX(created_at) as last_action_time
FROM action_history
WHERE DATE(created_at) = ?
GROUP BY device
ORDER BY toggle_count DESC
```

**Giải thích SQL:**
- `COUNT(*)`: Tổng số lượt bật/tắt
- `SUM(CASE WHEN action = 'on' ...)`: Đếm riêng số lượt BẬT
- `SUM(CASE WHEN action = 'off' ...)`: Đếm riêng số lượt TẮT
- `MAX(created_at)`: Lấy thời gian lần cuối
- `GROUP BY device`: Nhóm theo từng thiết bị
- `ORDER BY toggle_count DESC`: Sắp xếp giảm dần

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "device": "Light",
      "toggle_count": 25,
      "on_count": 13,
      "off_count": 12,
      "last_action_time": "2025-11-07T10:12:27.000Z"
    }
  ],
  "date": "2025-11-07"
}
```

### File: `backend/routes/api.js`

**Thêm routes:**
```javascript
const dashboardController = require('../controllers/dashboardController');

// Dashboard routes
router.get('/dashboard/sensor-threshold-stats', 
  dashboardController.getSensorThresholdStats);
router.get('/dashboard/device-toggle-stats', 
  dashboardController.getDeviceToggleStats);
```

---

## 🎨 Chi Tiết Frontend

### File: `frontend/src/pages/Dashboard.jsx`

#### 1. Import Dependencies

```javascript
import React, { useState, useEffect } from 'react';
import { 
  getSensorThresholdStats, 
  getDeviceToggleStats 
} from '../services/api';
```

#### 2. State Management

```javascript
const Dashboard = () => {
  // Threshold settings
  const [thresholds, setThresholds] = useState(getInitialThresholds());
  const [tempThresholds, setTempThresholds] = useState(getInitialThresholds());
  const [isEditingThresholds, setIsEditingThresholds] = useState(false);
  
  // Sensor stats
  const [sensorStats, setSensorStats] = useState(null);
  const [loadingSensor, setLoadingSensor] = useState(true);
  
  // Device stats
  const [deviceStats, setDeviceStats] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loadingDevice, setLoadingDevice] = useState(true);
};
```

**Giải thích State:**
- `thresholds`: Giá trị ngưỡng hiện tại (đang dùng)
- `tempThresholds`: Giá trị tạm khi đang edit (chưa lưu)
- `isEditingThresholds`: Bật/tắt mode chỉnh sửa
- `sensorStats`: Data từ API sensor threshold
- `loadingSensor`: Loading state cho sensor
- `deviceStats`: Data từ API device toggle
- `selectedDate`: Ngày được chọn
- `loadingDevice`: Loading state cho device

#### 3. localStorage Integration

```javascript
const getInitialThresholds = () => {
  const saved = localStorage.getItem('sensorThresholds');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing saved thresholds:', e);
    }
  }
  return { temperature: 30, humidity: 80, light: 700 };
};
```

**Giải thích:**
- Đọc từ localStorage khi component mount
- Nếu có data: parse JSON và dùng
- Nếu không có: dùng default values
- **Lợi ích**: Giữ settings khi chuyển trang hoặc refresh

#### 4. API Calls

**Load Sensor Stats:**
```javascript
const loadSensorStats = async () => {
  try {
    setLoadingSensor(true);
    const response = await getSensorThresholdStats(thresholds);
    if (response.success) {
      setSensorStats(response.data);
    }
  } catch (error) {
    console.error('Error loading sensor stats:', error);
  } finally {
    setLoadingSensor(false);
  }
};
```

**Load Device Stats:**
```javascript
const loadDeviceStats = async () => {
  try {
    setLoadingDevice(true);
    const response = await getDeviceToggleStats(selectedDate);
    if (response.success) {
      setDeviceStats(response.data);
    }
  } catch (error) {
    console.error('Error loading device stats:', error);
  } finally {
    setLoadingDevice(false);
  }
};
```

#### 5. useEffect Hooks

```javascript
// Auto reload khi thresholds thay đổi
useEffect(() => {
  loadSensorStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [thresholds]);

// Auto reload khi ngày thay đổi
useEffect(() => {
  loadDeviceStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedDate]);
```

**Giải thích:**
- useEffect theo dõi dependencies
- Khi `thresholds` hoặc `selectedDate` thay đổi → tự động gọi API mới
- React sẽ re-render với data mới

#### 6. Event Handlers

**Save Thresholds:**
```javascript
const handleSaveThresholds = () => {
  setThresholds({ ...tempThresholds });
  localStorage.setItem('sensorThresholds', JSON.stringify(tempThresholds));
  setIsEditingThresholds(false);
};
```

**Cancel Edit:**
```javascript
const handleCancelThresholds = () => {
  setTempThresholds({ ...thresholds }); // Reset về giá trị cũ
  setIsEditingThresholds(false);
};
```

#### 7. UI Components

**Threshold Settings Panel:**
```jsx
{isEditingThresholds && (
  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-4">
    <h3>Cài đặt ngưỡng cảm biến</h3>
    <div className="grid grid-cols-3 gap-4">
      <input 
        type="number"
        value={tempThresholds.temperature}
        onChange={(e) => setTempThresholds({
          ...tempThresholds, 
          temperature: parseFloat(e.target.value)
        })}
      />
      {/* Similar inputs for humidity and light */}
    </div>
  </div>
)}
```

**Sensor Stats Table:**
```jsx
<table>
  <thead>
    <tr>
      <th>Loại cảm biến</th>
      <th>Ngưỡng cài đặt</th>
      <th>Số lần vượt ngưỡng</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>🌡️ Nhiệt độ</td>
      <td>{sensorStats.temperature.threshold}°C</td>
      <td>{sensorStats.temperature.exceeded_count} lần</td>
    </tr>
    {/* Similar rows for humidity and light */}
  </tbody>
</table>
```

**Device Stats Table:**
```jsx
<table>
  <tbody>
    {deviceStats.map((stat, index) => (
      <tr key={stat.device}>
        <td>{index + 1}</td>
        <td>{stat.device}</td>
        <td>{stat.toggle_count}</td>
        <td>{stat.on_count}</td>
        <td>{stat.off_count}</td>
        <td>{new Date(stat.last_action_time).toLocaleString('vi-VN')}</td>
      </tr>
    ))}
  </tbody>
</table>
```

### File: `frontend/src/services/api.js`

**Thêm API methods:**
```javascript
export const getSensorThresholdStats = async (thresholds = {}) => {
  try {
    const params = new URLSearchParams();
    if (thresholds.temperature) 
      params.append('tempThreshold', thresholds.temperature);
    if (thresholds.humidity) 
      params.append('humidityThreshold', thresholds.humidity);
    if (thresholds.light) 
      params.append('lightThreshold', thresholds.light);

    const response = await api.get(
      `/dashboard/sensor-threshold-stats?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching sensor threshold stats:', error);
    throw error;
  }
};

export const getDeviceToggleStats = async (date) => {
  try {
    const params = new URLSearchParams();
    if (date) params.append('date', date);

    const response = await api.get(
      `/dashboard/device-toggle-stats?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching device toggle stats:', error);
    throw error;
  }
};
```

### File: `frontend/src/App.js`

**Thêm route:**
```javascript
import Dashboard from './pages/Dashboard';

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/data" element={<DataSensors />} />
  <Route path="/actions" element={<ActionHistory />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
</Routes>
```

### File: `frontend/src/components/Sidebar.jsx`

**Thêm menu item:**
```javascript
const menuItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/data', label: 'Data Sensors', icon: '📊' },
  { path: '/actions', label: 'Action History', icon: '📝' },
  { path: '/dashboard', label: 'Dashboard', icon: '📈' },
  { path: '/profile', label: 'Profile', icon: '👤' }
];
```

---

## 🛠️ Cách Tạo Dashboard (Từng Bước)

### Bước 1: Tạo Backend Controller

```bash
# Tạo file mới
touch backend/controllers/dashboardController.js
```

**Nội dung:**
1. Import `pool` từ config/db
2. Viết function `getSensorThresholdStats`:
   - Nhận query params (thresholds)
   - Viết SQL query với COUNT và CASE WHEN
   - Execute query với pool.query()
   - Format response JSON
3. Viết function `getDeviceToggleStats`:
   - Nhận query param (date)
   - Viết SQL với GROUP BY và ORDER BY
   - Execute query
   - Format response
4. Export các functions

### Bước 2: Thêm Routes

**File: `backend/routes/api.js`**
1. Import dashboardController
2. Thêm 2 routes GET:
   - `/dashboard/sensor-threshold-stats`
   - `/dashboard/device-toggle-stats`

### Bước 3: Test Backend APIs

```bash
# Test sensor stats
curl "http://localhost:5000/api/dashboard/sensor-threshold-stats"

# Test với custom thresholds
curl "http://localhost:5000/api/dashboard/sensor-threshold-stats?tempThreshold=25"

# Test device stats
curl "http://localhost:5000/api/dashboard/device-toggle-stats"

# Test với ngày cụ thể
curl "http://localhost:5000/api/dashboard/device-toggle-stats?date=2025-11-07"
```

### Bước 4: Tạo API Service (Frontend)

**File: `frontend/src/services/api.js`**
1. Viết function `getSensorThresholdStats`:
   - Nhận thresholds object
   - Build URLSearchParams
   - Call axios.get()
   - Return response.data
2. Viết function `getDeviceToggleStats`:
   - Nhận date string
   - Build URLSearchParams
   - Call axios.get()
   - Return response.data
3. Export functions

### Bước 5: Tạo Dashboard Component

**File: `frontend/src/pages/Dashboard.jsx`**

**5.1. Setup Component Structure:**
```javascript
import React, { useState, useEffect } from 'react';
import { getSensorThresholdStats, getDeviceToggleStats } from '../services/api';

const Dashboard = () => {
  // States here
  
  return (
    <div className="p-6">
      {/* Header */}
      {/* Sensor Threshold Stats Section */}
      {/* Device Toggle Stats Section */}
    </div>
  );
};

export default Dashboard;
```

**5.2. Implement State Management:**
- Khai báo tất cả states
- Viết function `getInitialThresholds()` để đọc localStorage
- Set initial values

**5.3. Implement API Calls:**
- Viết `loadSensorStats()` function
- Viết `loadDeviceStats()` function
- Thêm try-catch-finally cho error handling

**5.4. Implement useEffect:**
- useEffect cho thresholds → loadSensorStats
- useEffect cho selectedDate → loadDeviceStats

**5.5. Implement Event Handlers:**
- `handleSaveThresholds()`: Save to state + localStorage
- `handleCancelThresholds()`: Reset temp values

**5.6. Build UI:**
- Header section
- Threshold settings panel (conditional render)
- Sensor stats table với loading state
- Device stats table với loading state
- Date picker

**5.7. Styling với Tailwind:**
- Gradient headers
- Rounded corners
- Shadows
- Hover effects
- Responsive grid

### Bước 6: Thêm Route

**File: `frontend/src/App.js`**
1. Import Dashboard component
2. Thêm route `/dashboard`

### Bước 7: Thêm Menu Item

**File: `frontend/src/components/Sidebar.jsx`**
1. Thêm object mới vào `menuItems` array
2. Icon: 📈, Label: Dashboard, Path: /dashboard

### Bước 8: Test Frontend

1. Khởi động backend: `node server.js`
2. Khởi động frontend: `npm start`
3. Mở browser: `http://localhost:3000/dashboard`
4. Test các tính năng:
   - Load initial data
   - Edit thresholds
   - Save thresholds
   - Cancel edit
   - Change date
   - Navigate to other pages and back
   - Refresh page

### Bước 9: Debug & Fix

**Common Issues:**

1. **API không trả về data:**
   - Check backend console for errors
   - Check network tab trong DevTools
   - Verify SQL query syntax
   - Check database có data không

2. **Frontend không hiển thị:**
   - Check browser console for errors
   - Verify API response format
   - Check state updates với React DevTools
   - Verify conditional rendering logic

3. **localStorage không hoạt động:**
   - Check browser localStorage trong DevTools
   - Verify JSON.parse/stringify
   - Check getInitialThresholds logic

4. **Styling issues:**
   - Verify Tailwind classes
   - Check responsive breakpoints
   - Test trên nhiều screen sizes

---

## 📊 Database Schema

### Table: sensors_data
```sql
CREATE TABLE sensors_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  temperature DECIMAL(5,2) NOT NULL,
  humidity DECIMAL(5,2) NOT NULL,
  light INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at DESC),
  INDEX idx_temp_humidity (temperature, humidity),
  INDEX idx_light (light)
);
```

### Table: action_history
```sql
CREATE TABLE action_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device VARCHAR(50) NOT NULL,
  action VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at DESC),
  INDEX idx_device (device),
  INDEX idx_action (action),
  INDEX idx_device_action (device, action)
);
```

---

## 🔍 SQL Queries Explained

### Query 1: Sensor Threshold Stats

```sql
SELECT 
  COUNT(CASE WHEN temperature > 30 THEN 1 END) as temp_exceeded_count,
  COUNT(CASE WHEN humidity > 80 THEN 1 END) as humidity_exceeded_count,
  COUNT(CASE WHEN light > 700 THEN 1 END) as light_exceeded_count
FROM sensors_data
```

**Giải thích từng phần:**

1. `COUNT(CASE WHEN temperature > 30 THEN 1 END)`:
   - CASE WHEN: Kiểm tra điều kiện
   - Nếu temperature > 30: trả về 1
   - Nếu không: trả về NULL
   - COUNT: Đếm số lượng giá trị NON-NULL (bỏ qua NULL)
   - Kết quả: Số dòng có temperature > 30

2. Tương tự cho humidity và light

3. Chỉ cần 1 query duy nhất thay vì 3 queries riêng
   → Performance tốt hơn

### Query 2: Device Toggle Stats

```sql
SELECT 
  device,
  COUNT(*) as toggle_count,
  SUM(CASE WHEN action = 'on' THEN 1 ELSE 0 END) as on_count,
  SUM(CASE WHEN action = 'off' THEN 1 ELSE 0 END) as off_count,
  MAX(created_at) as last_action_time
FROM action_history
WHERE DATE(created_at) = '2025-11-07'
GROUP BY device
ORDER BY toggle_count DESC
```

**Giải thích từng phần:**

1. `COUNT(*)`: Đếm tất cả rows trong mỗi group

2. `SUM(CASE WHEN action = 'on' THEN 1 ELSE 0 END)`:
   - CASE WHEN: Nếu action = 'on' → 1, else → 0
   - SUM: Cộng tất cả các 1
   - Kết quả: Số lần action = 'on'

3. `MAX(created_at)`: Lấy timestamp mới nhất

4. `WHERE DATE(created_at) = '2025-11-07'`:
   - DATE(): Extract ngày từ timestamp
   - Filter chỉ lấy records của ngày đó

5. `GROUP BY device`:
   - Nhóm tất cả Light lại
   - Nhóm tất cả Fan lại
   - Nhóm tất cả Air condition lại

6. `ORDER BY toggle_count DESC`:
   - Sắp xếp từ cao → thấp
   - Thiết bị hoạt động nhiều nhất lên đầu

---

## 💾 localStorage Flow

### Lưu Data
```javascript
// 1. User click Lưu
handleSaveThresholds() {
  // 2. Update state
  setThresholds({ temperature: 25, humidity: 70, light: 500 });
  
  // 3. Convert to JSON string
  const json = JSON.stringify({ temperature: 25, humidity: 70, light: 500 });
  
  // 4. Save to localStorage
  localStorage.setItem('sensorThresholds', json);
}
```

### Đọc Data
```javascript
// 1. Component mount
getInitialThresholds() {
  // 2. Read from localStorage
  const saved = localStorage.getItem('sensorThresholds');
  // saved = '{"temperature":25,"humidity":70,"light":500}'
  
  // 3. Parse JSON string
  const parsed = JSON.parse(saved);
  // parsed = { temperature: 25, humidity: 70, light: 500 }
  
  // 4. Return object
  return parsed;
}
```

### Browser Storage
```
Application → Local Storage → http://localhost:3000
┌─────────────────────────────────────────────────┐
│ Key                 │ Value                     │
├─────────────────────────────────────────────────┤
│ sensorThresholds    │ {"temperature":25,...}    │
└─────────────────────────────────────────────────┘
```

---

## 🎨 UI/UX Design Principles

### 1. Consistent Color Scheme
```css
Primary: Blue (#3B82F6)
Secondary: Cyan (#06B6D4)
Success: Green (#10B981)
Warning: Yellow/Orange (#F59E0B)
Danger: Red (#EF4444)
```

### 2. Spacing System (Tailwind)
```
p-2  = 0.5rem = 8px
p-4  = 1rem   = 16px
p-6  = 1.5rem = 24px
p-8  = 2rem   = 32px
```

### 3. Typography Hierarchy
```
h1: text-2xl font-bold (24px)
h2: text-xl font-bold (20px)
body: text-sm (14px)
label: text-xs (12px)
```

### 4. Component States
- **Default**: Normal appearance
- **Hover**: Subtle background change
- **Active**: Highlighted
- **Loading**: Spinner animation
- **Empty**: Helpful message

### 5. Responsive Design
```jsx
className="grid grid-cols-1 md:grid-cols-3 gap-4"
```
- Mobile (default): 1 column
- Tablet (md): 3 columns
- Desktop: 3 columns

---

## 🔄 React Lifecycle

```
┌─────────────────────────────────────────────────┐
│  Component Mount (lần đầu)                      │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  1. Run constructor / useState                  │
│     → Initialize state với values từ localStorage│
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  2. First Render                                │
│     → Render với loading = true                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  3. useEffect runs (after render)               │
│     → Call loadSensorStats()                    │
│     → Call loadDeviceStats()                    │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  4. API responses arrive                        │
│     → setState(sensorStats)                     │
│     → setState(deviceStats)                     │
│     → setState(loading = false)                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  5. Re-render                                   │
│     → Display tables với data                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  User changes threshold or date                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  1. setState(thresholds / selectedDate)         │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  2. useEffect detects dependency change         │
│     → Call API again với params mới             │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  3. API response → setState → Re-render         │
└─────────────────────────────────────────────────┘
```

---

## 🐛 Common Bugs & Solutions

### Bug 1: "db.execute is not a function"
**Nguyên nhân:** Import sai từ config/db
**Solution:**
```javascript
// ❌ Wrong
const db = require('../config/db');
await db.execute(query);

// ✅ Correct
const { pool } = require('../config/db');
await pool.query(query);
```

### Bug 2: "rows[0].avg_temp.toFixed is not a function"
**Nguyên nhân:** avg_temp có thể là NULL
**Solution:**
```javascript
// ❌ Wrong
avg: parseFloat(rows[0].avg_temp.toFixed(2))

// ✅ Correct
avg: rows[0].avg_temp ? parseFloat(Number(rows[0].avg_temp).toFixed(2)) : 0
```

### Bug 3: Bảng không hiển thị data
**Nguyên nhân:** Tên bảng sai
**Solution:**
```sql
-- ❌ Wrong table name
FROM sensor_data

-- ✅ Correct table name
FROM sensors_data
```

### Bug 4: Thresholds bị reset khi chuyển trang
**Nguyên nhân:** Không lưu vào localStorage
**Solution:**
```javascript
// Thêm localStorage.setItem khi save
const handleSaveThresholds = () => {
  setThresholds(newValues);
  localStorage.setItem('sensorThresholds', JSON.stringify(newValues));
};
```

### Bug 5: useEffect chạy liên tục (infinite loop)
**Nguyên nhân:** Dependencies không đúng hoặc thiếu
**Solution:**
```javascript
// ❌ Wrong - will re-run every render
useEffect(() => {
  loadSensorStats();
});

// ✅ Correct - only run when thresholds change
useEffect(() => {
  loadSensorStats();
}, [thresholds]);
```

---

## 📈 Performance Optimization

### 1. Database Indexes
```sql
-- Index cho sensors_data
INDEX idx_created_at (created_at DESC),
INDEX idx_temp_humidity (temperature, humidity),
INDEX idx_light (light)

-- Index cho action_history
INDEX idx_created_at (created_at DESC),
INDEX idx_device (device),
INDEX idx_device_action (device, action)
```
→ Query nhanh hơn 10-100x

### 2. Connection Pooling
```javascript
const pool = mysql.createPool({
  connectionLimit: 10,  // Tối đa 10 connections
  queueLimit: 0        // Không giới hạn queue
});
```
→ Reuse connections thay vì tạo mới mỗi lần

### 3. Conditional Rendering
```jsx
{loading ? <Spinner /> : <Table data={data} />}
```
→ Không render table khi chưa có data

### 4. Debounce Input (Optional)
```javascript
// Nếu user gõ liên tục, chỉ call API sau khi ngừng 500ms
const debouncedSearch = useDebounce(searchTerm, 500);
```

### 5. Memoization (Optional)
```javascript
const memoizedStats = useMemo(() => {
  return calculateStats(data);
}, [data]);
```

---

## 🔐 Security Considerations

### 1. SQL Injection Prevention
```javascript
// ✅ GOOD - Using prepared statements
await pool.query('SELECT * FROM sensors_data WHERE temperature > ?', [threshold]);

// ❌ BAD - String concatenation
await pool.query(`SELECT * FROM sensors_data WHERE temperature > ${threshold}`);
```

### 2. Input Validation
```javascript
// Backend validation
if (isNaN(tempThreshold) || tempThreshold < 0 || tempThreshold > 100) {
  return res.status(400).json({ success: false, message: 'Invalid threshold' });
}
```

### 3. CORS Configuration
```javascript
app.use(cors()); // Allow all origins in development
// Production: Specify exact origins
app.use(cors({ origin: 'https://yourfrontend.com' }));
```

---

## 📝 Summary

### Backend (Node.js + Express + MySQL)
1. **Controller** (`dashboardController.js`):
   - 2 functions cho 2 APIs
   - SQL queries với aggregation (COUNT, SUM, GROUP BY)
   - Error handling với try-catch
   
2. **Routes** (`api.js`):
   - Register 2 GET endpoints
   - Connect controller functions

3. **Database**:
   - Sử dụng tables có sẵn (sensors_data, action_history)
   - Không cần migration mới

### Frontend (React.js + Tailwind CSS)
1. **Component** (`Dashboard.jsx`):
   - State management cho data và settings
   - localStorage integration cho persistence
   - API calls với axios
   - useEffect cho auto-reload
   - Event handlers cho user interactions
   - Responsive UI với Tailwind

2. **Services** (`api.js`):
   - Wrapper functions cho API calls
   - URLSearchParams để build query strings
   - Error handling

3. **Routing** (`App.js` + `Sidebar.jsx`):
   - Thêm route `/dashboard`
   - Thêm menu item với icon

### Key Technologies
- **Backend**: Node.js, Express, MySQL2, Promise-based queries
- **Frontend**: React Hooks (useState, useEffect), Axios, Tailwind CSS
- **Storage**: localStorage (browser), MySQL (server)
- **Communication**: RESTful APIs, JSON

### Architecture Pattern
- **MVC-like**: Controllers → Models (implicit in SQL) → Views (React)
- **API-first**: Backend as API server, Frontend as consumer
- **Stateless**: Backend không lưu user state, Frontend quản lý state
- **Responsive**: Mobile-first design với Tailwind

---

**Tài liệu này giải thích đầy đủ:** ✅
- Cách Dashboard hoạt động
- Luồng dữ liệu từ Database → Backend → Frontend → UI
- Cách tạo từng phần từ đầu
- SQL queries chi tiết
- React lifecycle và state management
- Common issues và solutions

**Tạo bởi:** AI Assistant  
**Ngày:** November 7, 2025  
**Version:** 1.0.0
