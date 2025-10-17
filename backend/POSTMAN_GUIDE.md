# Hướng dẫn Import và Sử dụng Postman Collection

## 1. Import Collection vào Postman

### Cách 1: Import từ File
1. Mở Postman Desktop hoặc Web
2. Click vào **Import** (góc trên bên trái)
3. Chọn tab **File**
4. Kéo thả hoặc chọn file `postman_collection.json`
5. Click **Import**

### Cách 2: Import từ URL (sau khi publish)
1. Mở Postman
2. Click **Import**
3. Chọn tab **Link**
4. Paste URL của collection (từ Postman workspace public)
5. Click **Continue** → **Import**

---

## 2. Cấu hình Environment

### Tạo Environment mới:
1. Click vào **Environments** ở sidebar bên trái
2. Click **+** để tạo environment mới
3. Đặt tên: `IoT Project - Local`
4. Thêm variable:
   - **Variable:** `base_url`
   - **Type:** `default`
   - **Initial Value:** `http://localhost:5000/api`
   - **Current Value:** `http://localhost:5000/api`
5. Click **Save**

### Chọn Environment:
1. Ở góc trên bên phải Postman
2. Click vào dropdown "No Environment"
3. Chọn `IoT Project - Local`

---

## 3. Sử dụng Collection

### Thứ tự test APIs (Recommended):

#### A. Test Profile API trước (không cần backend chạy nếu muốn test static data)
1. Mở folder **4. Profile API**
2. Click vào **Get Profile**
3. Click **Send**
4. Kiểm tra response:
   ```json
   {
     "success": true,
     "data": {
       "name": "Nguyễn Nhật Quang",
       "msv": "B22DCCN645",
       ...
     }
   }
   ```

#### B. Test Sensor APIs (cần backend + database running)
1. Mở folder **1. Sensor APIs**
2. Test **Get Latest Sensor Data**:
   - Click **Send**
   - Kiểm tra response có data sensor mới nhất
3. Test **Get Sensor History - All Data**:
   - Xem toàn bộ lịch sử
4. Test **Get Sensor History - Filter by Temperature**:
   - Thử các bộ lọc khác nhau
5. Test **Get Sensor History - Search by Keyword**:
   - Tìm kiếm theo từ khóa

#### C. Test Action History APIs
1. Mở folder **2. Action History APIs**
2. Test **Get Latest Actions**:
   - Xem trạng thái thiết bị hiện tại
3. Test **Get Action History - All Actions**:
   - Xem toàn bộ lịch sử điều khiển
4. Test các filters:
   - **Filter by Device (Light)**
   - **Filter by Status (ON)**
   - **Combined Filters**
5. Test **Get Device State** cho từng thiết bị:
   - Light
   - Fan
   - Air Condition

#### D. Test Device Control APIs (cần backend + MQTT + ESP32)
1. Mở folder **3. Device Control APIs**
2. Test bật/tắt từng thiết bị:
   - **Turn ON Light** → **Turn OFF Light**
   - **Turn ON Fan** → **Turn OFF Fan**
   - **Turn ON Air Condition** → **Turn OFF Air Condition**
3. Sau mỗi request, kiểm tra:
   - Response trả về success
   - ESP32 phản hồi qua MQTT
   - Database lưu action history
   - Socket.IO emit event `action-update`

---

## 4. Tính năng Nâng cao

### A. Save Example Responses
1. Sau khi Send request thành công
2. Click **Save Response** ở panel bên phải
3. Đặt tên cho example (ví dụ: "Success Response")
4. Example này sẽ hiển thị trong documentation

### B. Tạo Tests (Automation)
Click vào tab **Tests** trong request và thêm:

```javascript
// Test cho API thành công
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData.success).to.be.true;
});

pm.test("Response has data field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
});
```

### C. Tạo Pre-request Scripts
Nếu cần dynamic data (ví dụ: timestamp):

```javascript
// Generate current timestamp
pm.globals.set("timestamp", new Date().toISOString());
```

### D. Run Collection (Test toàn bộ APIs)
1. Click vào **...** bên cạnh tên collection
2. Chọn **Run collection**
3. Chọn các requests muốn test
4. Click **Run IoT Project API**
5. Xem kết quả test tổng hợp

---

## 5. Publish Collection (Share với người khác)

### Publish lên Postman Public Workspace:
1. Click vào **...** bên cạnh collection
2. Chọn **Share**
3. Chọn tab **Via JSON link**
4. Click **Get public link**
5. Copy link và chia sẻ

### Hoặc Export và chia sẻ file:
1. Click vào **...** bên cạnh collection
2. Chọn **Export**
3. Chọn **Collection v2.1 (recommended)**
4. Save file và chia sẻ qua email/github

---

## 6. Generate API Documentation

### Auto-generate documentation từ collection:
1. Click vào collection trong sidebar
2. Click vào tab **Documentation**
3. Click **Publish**
4. Chọn version và environment
5. Click **Publish**
6. Copy public documentation URL

Postman sẽ tự động tạo documentation đẹp mắt với:
- Tất cả endpoints
- Request examples
- Response examples
- Descriptions
- Parameters

---

## 7. Kiểm tra Backend đang chạy

Trước khi test APIs, đảm bảo:

### Backend Server:
```bash
cd backend
node server.js
```
Kiểm tra: `Server running on port 5000`

### MySQL Database:
```bash
mysql -u root -p
USE iot_project;
SHOW TABLES;
```

### MQTT Broker:
- HiveMQ Cloud broker đang hoạt động
- Credentials đúng trong `.env`

### ESP32 Hardware:
- Kết nối WiFi
- Kết nối MQTT broker
- Sensors hoạt động

---

## 8. Troubleshooting

### Lỗi "Could not get response"
- Kiểm tra backend có đang chạy không
- Kiểm tra URL và port đúng chưa
- Firewall có block port 5000 không

### Lỗi "Invalid device" hoặc "Invalid action"
- Kiểm tra request body format
- Đảm bảo device: `led1`, `led2`, hoặc `led3`
- Đảm bảo action: `on` hoặc `off`

### Lỗi "No data found"
- Database có data chưa
- ESP32 có gửi data qua MQTT chưa
- Kiểm tra MQTT connection

---

## 9. Tips & Best Practices

1. **Sử dụng Variables** cho các giá trị thay đổi thường xuyên
2. **Save Examples** để documentation đầy đủ hơn
3. **Write Tests** để automation testing
4. **Organize folders** theo logic rõ ràng
5. **Add descriptions** cho từng request
6. **Version control** collection bằng Git

---

## 10. Collection Structure

```
IoT Project API
├── 1. Sensor APIs
│   ├── Get Latest Sensor Data
│   ├── Get Sensor History - All Data
│   ├── Get Sensor History - Filter by Temperature
│   └── Get Sensor History - Search by Keyword
├── 2. Action History APIs
│   ├── Get Latest Actions
│   ├── Get Action History - All Actions
│   ├── Get Action History - Filter by Device
│   ├── Get Action History - Filter by Status
│   ├── Get Action History - Combined Filters
│   ├── Get Device State - Light
│   ├── Get Device State - Fan
│   └── Get Device State - Air Condition
├── 3. Device Control APIs
│   ├── Turn ON Light
│   ├── Turn OFF Light
│   ├── Turn ON Fan
│   ├── Turn OFF Fan
│   ├── Turn ON Air Condition
│   └── Turn OFF Air Condition
└── 4. Profile API
    └── Get Profile
```

---

## Liên hệ
- Email: nnq148@gmail.com
- GitHub: https://github.com/nnq148
- Postman Collection: [Your Postman Link]
