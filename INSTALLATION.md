# 🚀 Hướng dẫn cài đặt và chạy dự án IoT

## Bước 1: Cài đặt Backend

### 1.1. Mở PowerShell hoặc Command Prompt

### 1.2. Di chuyển vào thư mục backend
```powershell
cd c:\Users\Admin\iot-project\backend
```

### 1.3. Cài đặt dependencies
**Nếu gặp lỗi Execution Policy với PowerShell, sử dụng một trong các cách sau:**

**Cách 1: Chạy với quyền Administrator**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
npm install
```

**Cách 2: Sử dụng Command Prompt (cmd)**
- Mở Command Prompt
- Chạy: `cd c:\Users\Admin\iot-project\backend`
- Chạy: `npm install`

**Cách 3: Sử dụng Git Bash hoặc terminal khác**

### 1.4. Cấu hình .env
File `.env` đã được tạo sẵn. Chỉnh sửa nếu cần:
- Mở file `backend\.env`
- Cập nhật `DB_PASS` (password MySQL của bạn)
- Các thông tin khác giữ nguyên

### 1.5. Thiết lập MySQL Database

**Mở MySQL Command Line hoặc MySQL Workbench:**

```sql
-- Tạo database
CREATE DATABASE IF NOT EXISTS iotdb;

-- Kiểm tra
SHOW DATABASES;
USE iotdb;
```

**Lưu ý:** Backend sẽ tự động tạo các bảng khi khởi động lần đầu.

### 1.6. Chạy Backend Server

```powershell
# Trong thư mục backend
node server.js

# Hoặc nếu đã cài nodemon:
npm run dev
```

**Kết quả mong đợi:**
```
🚀 Đang khởi động IoT Backend Server...

📦 Kiểm tra kết nối MySQL...
✅ Kết nối MySQL thành công
📦 Tạo bảng database...
✅ Bảng database đã được tạo thành công
🔌 Khởi tạo Socket.IO...
📡 Khởi tạo MQTT connection...
✅ MQTT đã kết nối thành công
📡 Đã subscribe: sensors/data
📡 Đã subscribe: Status/led1
📡 Đã subscribe: Status/led2
📡 Đã subscribe: Status/led3

✅ ========================================
✅ IoT Backend Server đang chạy
✅ Port: 5000
✅ URL: http://localhost:5000
✅ Socket.IO: ws://localhost:5000
✅ ========================================
```

**Test backend:**
- Mở trình duyệt: http://localhost:5000/health
- Kết quả: `{"status":"OK","message":"IoT Backend Server is running","timestamp":"..."}`

---

## Bước 2: Cài đặt Frontend

### 2.1. Mở terminal mới (giữ backend đang chạy)

### 2.2. Di chuyển vào thư mục frontend
```powershell
cd c:\Users\Admin\iot-project\frontend
```

### 2.3. Cài đặt dependencies
```powershell
npm install
```

**Nếu gặp lỗi, thử:**
```powershell
npm install --legacy-peer-deps
```

### 2.4. Chạy Frontend

```powershell
npm start
```

Frontend sẽ tự động mở trình duyệt tại: **http://localhost:3000**

**Kết quả mong đợi:**
```
Compiled successfully!

You can now view iot-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

## Bước 3: Kết nối ESP32

### 3.1. Kiểm tra ESP32 đã nạp code

Code ESP32 cần có:
- Kết nối WiFi
- Kết nối MQTT broker: `f12034700b2d452b8de9508ddec28f11.s1.eu.hivemq.cloud:8883`
- Username: `nnq148`
- Password: `Quang2004`

### 3.2. Subscribe topics:
- `Control/led` - Nhận lệnh điều khiển

### 3.3. Publish topics:
- `sensors/data` - Gửi dữ liệu cảm biến (format: "temp,hum,light")
- `Status/led1` - Gửi trạng thái LED1 ("ON"/"OFF")
- `Status/led2` - Gửi trạng thái LED2 ("ON"/"OFF")
- `Status/led3` - Gửi trạng thái LED3 ("ON"/"OFF")

### 3.4. Mở Serial Monitor để kiểm tra
```
Baud rate: 115200
```

---

## Bước 4: Kiểm tra hệ thống hoạt động

### 4.1. Kiểm tra Backend
- [ ] MySQL đã kết nối
- [ ] MQTT đã kết nối
- [ ] Socket.IO đã khởi tạo
- [ ] Server chạy tại port 5000

### 4.2. Kiểm tra Frontend
- [ ] Website mở tại http://localhost:3000
- [ ] Có 4 trang: Dashboard, Data Sensors, Action History, Profile
- [ ] Socket.IO connected (xem Console)

### 4.3. Kiểm tra ESP32
- [ ] Kết nối WiFi thành công
- [ ] Kết nối MQTT thành công
- [ ] Gửi dữ liệu cảm biến 5s/lần

### 4.4. Test chức năng

**Test 1: Nhận dữ liệu cảm biến**
1. ESP32 gửi dữ liệu lên topic `sensors/data`
2. Backend nhận và lưu vào MySQL
3. Frontend hiển thị realtime trên Dashboard
4. Biểu đồ cập nhật

**Test 2: Điều khiển thiết bị**
1. Trên Dashboard, bật/tắt một thiết bị (Đèn, Quạt, Điều hòa)
2. Frontend gửi request tới Backend
3. Backend publish lệnh lên topic `Control/led`
4. ESP32 nhận lệnh và thực hiện
5. ESP32 gửi trạng thái lên topic `Status/ledX`
6. Backend nhận xác nhận và lưu vào database
7. Frontend cập nhật trạng thái thiết bị

**Test 3: Xem lịch sử**
1. Truy cập trang "Data Sensors"
2. Xem bảng dữ liệu cảm biến
3. Test filter theo ngày
4. Test search

5. Truy cập trang "Action History"
6. Xem bảng lịch sử hành động
7. Test filter và search

**Test 4: Profile**
1. Truy cập trang "Profile"
2. Xem thông tin sinh viên
3. Kiểm tra các link

---

## 🔧 Xử lý lỗi thường gặp

### Lỗi 1: Backend không kết nối MySQL
```
❌ Lỗi kết nối MySQL: connect ECONNREFUSED
```
**Giải pháp:**
- Kiểm tra MySQL đang chạy
- Kiểm tra thông tin trong `.env`
- Chạy lệnh: `mysql -u root -p` để test

### Lỗi 2: Backend không kết nối MQTT
```
❌ MQTT error: Connection refused
```
**Giải pháp:**
- Kiểm tra internet
- Kiểm tra credentials trong `.env`
- Test với MQTT Explorer

### Lỗi 3: Frontend không kết nối backend
```
Error: Network Error
```
**Giải pháp:**
- Kiểm tra backend đang chạy
- Kiểm tra port 5000 không bị chiếm
- Mở http://localhost:5000/health

### Lỗi 4: Socket.IO không kết nối
```
❌ Socket.IO connection error
```
**Giải pháp:**
- Kiểm tra backend Socket.IO đã khởi động
- Mở Console và xem logs
- Kiểm tra CORS settings

### Lỗi 5: ESP32 không gửi dữ liệu
**Giải pháp:**
- Mở Serial Monitor
- Kiểm tra WiFi đã kết nối
- Kiểm tra MQTT đã kết nối
- Kiểm tra code ESP32

### Lỗi 6: npm install bị lỗi Execution Policy
```powershell
# Chạy PowerShell as Administrator:
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

# Hoặc sử dụng Command Prompt
```

---

## 📊 Cấu trúc Database

### Bảng `sensors_data`
```sql
| id | temperature | humidity | light | created_at |
|----|-------------|----------|-------|------------|
| 1  | 28.50       | 65.30    | 450   | 2025-...   |
```

### Bảng `action_history`
```sql
| id | device         | action | created_at |
|----|----------------|--------|------------|
| 1  | Light          | on     | 2025-...   |
| 2  | Fan            | off    | 2025-...   |
```

---

## 📝 Checklist tổng hợp

**Backend:**
- [ ] Node.js đã cài đặt
- [ ] MySQL đã cài đặt và chạy
- [ ] File `.env` đã cấu hình đúng
- [ ] `npm install` thành công
- [ ] Database `iotdb` đã tạo
- [ ] Server chạy thành công tại port 5000

**Frontend:**
- [ ] `npm install` thành công
- [ ] Server chạy thành công tại port 3000
- [ ] Website hiển thị đúng
- [ ] Socket.IO kết nối thành công

**ESP32:**
- [ ] Code đã nạp
- [ ] WiFi kết nối thành công
- [ ] MQTT kết nối thành công
- [ ] Gửi dữ liệu thành công

**Chức năng:**
- [ ] Nhận dữ liệu cảm biến realtime
- [ ] Điều khiển thiết bị thành công
- [ ] Biểu đồ realtime hoạt động
- [ ] Xem lịch sử dữ liệu
- [ ] Xem lịch sử hành động
- [ ] Profile hiển thị đúng

---

## 📞 Liên hệ hỗ trợ

**Nguyễn Nhật Quang**
- Email: nnq148@gmail.com
- SĐT: 0936201378

---

**Chúc bạn cài đặt thành công! 🎉**
