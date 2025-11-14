# Dashboard - Trang Thống Kê Mới

## 📊 Tính Năng

Trang Dashboard mới đã được thêm vào hệ thống với 2 bảng thống kê chính:

### 1. Thống Kê Vượt Ngưỡng Cảm Biến
- **Hiển thị**: Số lần mỗi cảm biến (nhiệt độ, độ ẩm, ánh sáng) vượt ngưỡng đã đặt
- **Tính năng**:
  - ⚙️ Cài đặt giá trị ngưỡng cho từng loại cảm biến
  - 📈 Hiển thị giá trị Max, Min, Average
  - 🎨 Màu sắc thay đổi theo mức độ cảnh báo:
    - Xanh lá: 0 lần vượt (an toàn)
    - Vàng: < 10 lần (chú ý)
    - Cam: < 50 lần (cảnh báo)
    - Đỏ: ≥ 50 lần (nguy hiểm)

### 2. Thống Kê Bật/Tắt Thiết Bị
- **Hiển thị**: Số lượt bật/tắt của mỗi thiết bị trong ngày
- **Tính năng**:
  - 📅 Chọn ngày để xem thống kê
  - 🔄 Sắp xếp giảm dần theo số lượt bật/tắt
  - 🏆 Highlight thiết bị có số lượt cao nhất
  - 📊 Hiển thị chi tiết: Tổng số lượt, Lượt BẬT, Lượt TẮT, Thời gian lần cuối

## 🚀 Cách Sử Dụng

### Backend APIs

#### 1. API Thống Kê Vượt Ngưỡng Cảm Biến
```
GET /api/dashboard/sensor-threshold-stats
```

**Query Parameters**:
- `tempThreshold` (optional, default: 30): Ngưỡng nhiệt độ (°C)
- `humidityThreshold` (optional, default: 80): Ngưỡng độ ẩm (%)
- `lightThreshold` (optional, default: 700): Ngưỡng ánh sáng (lux)

**Example**:
```bash
GET /api/dashboard/sensor-threshold-stats?tempThreshold=28&humidityThreshold=75&lightThreshold=600
```

**Response**:
```json
{
  "success": true,
  "data": {
    "temperature": {
      "threshold": 28,
      "exceeded_count": 15,
      "max": 35.2,
      "min": 20.1,
      "avg": 27.5
    },
    "humidity": {
      "threshold": 75,
      "exceeded_count": 8,
      "max": 85.3,
      "min": 45.2,
      "avg": 65.8
    },
    "light": {
      "threshold": 600,
      "exceeded_count": 42,
      "max": 950,
      "min": 150,
      "avg": 520.3
    }
  }
}
```

#### 2. API Thống Kê Bật/Tắt Thiết Bị
```
GET /api/dashboard/device-toggle-stats
```

**Query Parameters**:
- `date` (optional, default: today): Ngày cần xem thống kê (YYYY-MM-DD)

**Example**:
```bash
GET /api/dashboard/device-toggle-stats?date=2025-10-17
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "device": "Light",
      "toggle_count": 25,
      "on_count": 13,
      "off_count": 12,
      "last_action_time": "2025-10-17T15:30:00.000Z"
    },
    {
      "device": "Fan",
      "toggle_count": 18,
      "on_count": 9,
      "off_count": 9,
      "last_action_time": "2025-10-17T14:20:00.000Z"
    },
    {
      "device": "Air condition",
      "toggle_count": 10,
      "on_count": 5,
      "off_count": 5,
      "last_action_time": "2025-10-17T13:15:00.000Z"
    }
  ],
  "date": "2025-10-17"
}
```

#### 3. API Lịch Sử Toggle Thiết Bị
```
GET /api/dashboard/device-toggle-history
```

**Query Parameters**:
- `days` (optional, default: 7): Số ngày cần lấy lịch sử

**Example**:
```bash
GET /api/dashboard/device-toggle-history?days=14
```

### Frontend

Truy cập trang Dashboard tại: `http://localhost:3000/dashboard`

**Các tính năng UI**:

1. **Cài đặt ngưỡng cảm biến**:
   - Click nút "⚙️ Cài đặt ngưỡng"
   - Nhập giá trị ngưỡng mới cho từng loại cảm biến
   - Click "✅ Lưu" để áp dụng hoặc "❌ Hủy" để không lưu

2. **Xem thống kê theo ngày**:
   - Chọn ngày từ date picker
   - Bảng thống kê tự động cập nhật
   - Dữ liệu được sắp xếp theo số lượt bật/tắt (cao → thấp)

## 📁 Files Đã Tạo/Cập Nhật

### Backend
- ✅ `backend/controllers/dashboardController.js` (NEW) - Controller xử lý dashboard APIs
- ✅ `backend/routes/api.js` (UPDATED) - Thêm 3 routes mới cho dashboard

### Frontend
- ✅ `frontend/src/pages/Dashboard.jsx` (NEW) - Component trang Dashboard
- ✅ `frontend/src/services/api.js` (UPDATED) - Thêm 3 API methods mới
- ✅ `frontend/src/App.js` (UPDATED) - Thêm route /dashboard
- ✅ `frontend/src/components/Sidebar.jsx` (UPDATED) - Thêm menu item Dashboard

## 🎨 Giao Diện

### Thống Kê Vượt Ngưỡng
- 3 cards màu sắc theo mức độ (xanh/vàng/cam/đỏ)
- Icon đặc trưng cho mỗi loại cảm biến
- Hiển thị đầy đủ: Số lần vượt, Trung bình, Max, Min

### Bảng Thống Kê Thiết Bị
- Header gradient xanh dương đẹp mắt
- Trophy icon 🏆 cho thiết bị xếp hạng 1
- Badge màu xanh cho "Lượt BẬT" và đỏ cho "Lượt TẮT"
- Hover effect để dễ theo dõi

## 🔧 Cách Test

### 1. Khởi động Backend
```bash
cd backend
node server.js
```

### 2. Khởi động Frontend
```bash
cd frontend
npm start
```

### 3. Truy cập Dashboard
- Mở trình duyệt: `http://localhost:3000/dashboard`
- Hoặc click menu "📈 Dashboard" trên sidebar

### 4. Test API trực tiếp
```bash
# Test sensor threshold stats
curl "http://localhost:5000/api/dashboard/sensor-threshold-stats?tempThreshold=30&humidityThreshold=80&lightThreshold=700"

# Test device toggle stats (today)
curl "http://localhost:5000/api/dashboard/device-toggle-stats"

# Test device toggle stats (specific date)
curl "http://localhost:5000/api/dashboard/device-toggle-stats?date=2025-10-17"

# Test device toggle history
curl "http://localhost:5000/api/dashboard/device-toggle-history?days=7"
```

## 📊 Database Queries

Dashboard sử dụng các SQL queries tối ưu:

1. **Sensor Threshold Stats**: Sử dụng `COUNT(CASE WHEN ...)` để đếm hiệu quả
2. **Device Toggle Stats**: Sử dụng `GROUP BY` + `ORDER BY` để sắp xếp
3. **Không cần thêm bảng mới** - Dùng luôn `sensor_data` và `action_history` có sẵn

## 🎯 Tính Năng Nổi Bật

✅ **Realtime Updates**: Dữ liệu cập nhật tự động khi thay đổi ngưỡng/ngày  
✅ **Responsive Design**: Giao diện đẹp trên mọi kích thước màn hình  
✅ **User-Friendly**: Dễ sử dụng với date picker và settings panel  
✅ **Visual Feedback**: Màu sắc thay đổi theo mức độ cảnh báo  
✅ **Sortable Data**: Tự động sắp xếp theo độ ưu tiên  

---

**Created**: October 17, 2025  
**Version**: 1.0.0  
**Status**: ✅ Hoàn thành
