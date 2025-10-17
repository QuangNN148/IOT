# API Testing Workflow với Postman

## 🎯 Tổng quan

Dự án này cung cấp đầy đủ API documentation và Postman collection để test tất cả endpoints.

## 📁 Files quan trọng

1. **`API_DOCUMENTATION.md`** - Documentation chi tiết của tất cả APIs
2. **`postman_collection.json`** - Postman collection có thể import
3. **`POSTMAN_GUIDE.md`** - Hướng dẫn sử dụng Postman từ A-Z

## 🚀 Quick Start với Postman

### Bước 1: Import Collection
```
1. Mở Postman
2. Click "Import" → Chọn file "postman_collection.json"
3. Collection "IoT Project API" sẽ xuất hiện
```

### Bước 2: Setup Environment
```
1. Click "Environments" → Create new
2. Tên: "IoT Project - Local"
3. Thêm variable:
   - base_url = http://localhost:5000/api
4. Save và chọn environment này
```

### Bước 3: Test APIs
```
1. Đảm bảo backend đang chạy (node server.js)
2. Test theo thứ tự:
   ✅ Profile API (không cần backend)
   ✅ Sensor APIs (cần backend + database)
   ✅ Action History APIs (cần backend + database)
   ✅ Control APIs (cần backend + MQTT + ESP32)
```

## 📊 Collection Structure

```
IoT Project API Collection
│
├── 1. Sensor APIs (4 requests)
│   ├── Get Latest Sensor Data
│   ├── Get Sensor History - All Data
│   ├── Get Sensor History - Filter by Temperature
│   └── Get Sensor History - Search by Keyword
│
├── 2. Action History APIs (8 requests)
│   ├── Get Latest Actions
│   ├── Get Action History - All Actions
│   ├── Get Action History - Filter by Device
│   ├── Get Action History - Filter by Status
│   ├── Get Action History - Combined Filters
│   ├── Get Device State - Light
│   ├── Get Device State - Fan
│   └── Get Device State - Air Condition
│
├── 3. Device Control APIs (6 requests)
│   ├── Turn ON/OFF Light (led1)
│   ├── Turn ON/OFF Fan (led2)
│   └── Turn ON/OFF Air Condition (led3)
│
└── 4. Profile API (1 request)
    └── Get Profile
```

## 🔥 Test Scenarios

### Scenario 1: Kiểm tra Sensor Data
```
1. GET /sensors/latest
   → Xem dữ liệu sensor mới nhất

2. GET /sensors/history?limit=50
   → Xem 50 records gần nhất

3. GET /sensors/history?dataType=temp&sortBy=temperature&sortOrder=DESC
   → Lọc theo nhiệt độ, sắp xếp giảm dần

4. GET /sensors/history?search=27
   → Tìm kiếm theo từ khóa "27"
```

### Scenario 2: Kiểm tra Action History
```
1. GET /actions/latest
   → Xem trạng thái thiết bị hiện tại

2. GET /actions/history?deviceFilter=Light&actionFilter=ON
   → Xem lịch sử đèn được bật

3. GET /actions/state/Light
   → Kiểm tra trạng thái của đèn
```

### Scenario 3: Điều khiển thiết bị
```
1. POST /control
   Body: { "device": "led1", "action": "on" }
   → Bật đèn

2. GET /actions/state/Light
   → Verify trạng thái đèn = ON

3. POST /control
   Body: { "device": "led1", "action": "off" }
   → Tắt đèn

4. GET /actions/state/Light
   → Verify trạng thái đèn = OFF
```

## 🎨 Publish Documentation

### Cách 1: Postman Public Documentation
```
1. Click vào collection → Documentation tab
2. Click "Publish"
3. Chọn environment và version
4. Click "Publish Collection"
5. Copy public URL và chia sẻ
```

### Cách 2: Export và host trên web
```
1. Export collection → Save as JSON
2. Upload lên GitHub repository
3. Share link hoặc tạo GitHub Pages
```

### Cách 3: Generate static HTML
```
# Sử dụng postman-to-html (optional)
npm install -g postman-to-html
postman-to-html -i postman_collection.json -o api-docs.html
```

## 🔗 Share Collection với Team

### Option 1: Postman Workspace (Recommended)
```
1. Tạo Postman Workspace (Free)
2. Invite team members
3. Sync collection tự động
4. Collaborate realtime
```

### Option 2: Export & Import
```
1. Export collection → JSON file
2. Share file qua email/drive/github
3. Team members import vào Postman
```

### Option 3: Public Link
```
1. Publish collection publicly
2. Share link
3. Anyone có thể "Fork" collection
```

## 🧪 Automation Testing

### Run Collection với Newman (CLI)
```bash
# Install newman
npm install -g newman

# Run collection
newman run postman_collection.json -e environment.json

# Run với reporters
newman run postman_collection.json -e environment.json \
  --reporters cli,html \
  --reporter-html-export report.html
```

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Run API Tests
  run: |
    npm install -g newman
    newman run backend/postman_collection.json \
      --env-var "base_url=http://localhost:5000/api"
```

## 📈 Monitoring với Postman Monitor

```
1. Click collection → ... → Monitor collection
2. Setup schedule (hourly, daily, etc.)
3. Add notification channels (email, slack)
4. Postman sẽ tự động chạy tests và báo lỗi
```

## 🎓 Best Practices

### 1. Organization
- ✅ Nhóm APIs theo chức năng logic
- ✅ Đặt tên requests rõ ràng và mô tả đầy đủ
- ✅ Sắp xếp theo thứ tự workflow

### 2. Documentation
- ✅ Viết description cho mỗi request
- ✅ Save example responses (success & error)
- ✅ Document tất cả parameters

### 3. Testing
- ✅ Viết tests để validate responses
- ✅ Test cả success và error cases
- ✅ Use pre-request scripts khi cần

### 4. Variables
- ✅ Dùng environment variables cho URLs
- ✅ Dùng collection variables cho shared data
- ✅ Dùng global variables cho configs

### 5. Maintenance
- ✅ Version control collection (Git)
- ✅ Sync với code changes
- ✅ Update documentation thường xuyên

## 🌟 Advanced Features

### Mock Servers
```
Tạo mock server từ collection để test frontend trước khi backend ready
```

### API Versioning
```
Tạo folders cho v1, v2, v3 trong collection
```

### Pre-request Scripts
```javascript
// Generate dynamic data
pm.environment.set("timestamp", Date.now());
pm.environment.set("random_id", Math.floor(Math.random() * 1000));
```

### Tests Scripts
```javascript
// Validate response structure
pm.test("Response structure is correct", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData).to.have.property('data');
});

// Chain requests
if (pm.response.code === 200) {
    var deviceId = pm.response.json().data.id;
    pm.environment.set("device_id", deviceId);
}
```

## 📞 Support

Nếu gặp vấn đề:
1. Xem POSTMAN_GUIDE.md
2. Xem API_DOCUMENTATION.md
3. Check backend logs
4. Contact: nnq148@gmail.com

## 🔗 Resources

- [Postman Learning Center](https://learning.postman.com/)
- [Postman API Documentation](https://www.postman.com/api-documentation-tool/)
- [Newman CLI](https://github.com/postmanlabs/newman)
