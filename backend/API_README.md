# 📚 API Documentation & Postman - Tổng quan

## 🎯 Mục đích

Cung cấp đầy đủ documentation và tools để test, quản lý, và chia sẻ APIs của dự án IoT.

---

## 📁 Cấu trúc Files

```
backend/
├── API_DOCUMENTATION.md      ⭐ Full API documentation (chi tiết nhất)
├── POSTMAN_GUIDE.md          📖 Hướng dẫn sử dụng Postman từ A-Z
├── POSTMAN_WORKFLOW.md       🔄 Workflow và best practices
├── postman_collection.json   📦 Postman collection (import vào Postman)
├── test-api.sh              🧪 Test script cho Linux/Mac
└── test-api.ps1             🧪 Test script cho Windows
```

---

## 🚀 Quick Start (3 bước)

### Bước 1: Import Postman Collection
```
1. Mở Postman Desktop/Web
2. Click "Import"
3. Chọn file: postman_collection.json
4. Done! Collection xuất hiện với 19 requests
```

### Bước 2: Setup Environment
```
1. Tạo environment mới: "IoT Project - Local"
2. Thêm variable:
   - base_url = http://localhost:5000/api
3. Save và select environment
```

### Bước 3: Test APIs
```
1. Chạy backend: node server.js
2. Test từng folder trong collection
3. Xem response và verify kết quả
```

---

## 📖 Chi tiết các Files

### 1. API_DOCUMENTATION.md ⭐
**Mô tả**: Documentation đầy đủ nhất của tất cả APIs

**Nội dung**:
- Base URL và response format
- 4 nhóm APIs:
  - Sensor APIs (2 endpoints)
  - Action History APIs (3 endpoints)
  - Device Control API (1 endpoint)
  - Profile API (1 endpoint)
- Socket.IO events
- Error codes
- Device mapping
- MQTT topics

**Khi nào dùng**:
- ✅ Cần tham khảo API specifications
- ✅ Viết code integrate APIs
- ✅ Debug và troubleshooting
- ✅ Onboard team members mới

---

### 2. POSTMAN_GUIDE.md 📖
**Mô tả**: Hướng dẫn chi tiết cách sử dụng Postman

**Nội dung**:
- Import collection (2 cách)
- Cấu hình environment
- Thứ tự test APIs recommended
- Tính năng nâng cao:
  - Save responses
  - Write tests
  - Pre-request scripts
  - Run collection
- Publish và share collection
- Generate documentation
- Troubleshooting

**Khi nào dùng**:
- ✅ Lần đầu sử dụng Postman
- ✅ Muốn học các tính năng advanced
- ✅ Cần share collection với team
- ✅ Setup automation testing

---

### 3. POSTMAN_WORKFLOW.md 🔄
**Mô tả**: Best practices và workflow làm việc với Postman

**Nội dung**:
- Test scenarios (3 scenarios chính)
- Publish documentation
- Share collection (3 options)
- Automation testing với Newman
- CI/CD integration
- Monitoring
- Best practices (5 categories)
- Advanced features

**Khi nào dùng**:
- ✅ Muốn setup workflow chuẩn
- ✅ Integrate với CI/CD
- ✅ Team collaboration
- ✅ Production monitoring

---

### 4. postman_collection.json 📦
**Mô tả**: Postman collection file (import directly)

**Nội dung**:
- 19 requests trong 4 folders
- Pre-configured requests với:
  - URLs và variables
  - Headers
  - Body templates
  - Descriptions

**Khi nào dùng**:
- ✅ Import vào Postman để test APIs
- ✅ Share với team members
- ✅ Version control (Git)
- ✅ Automation với Newman CLI

---

### 5. test-api.sh & test-api.ps1 🧪
**Mô tả**: Scripts để test APIs từ terminal/command line

**Nội dung**:
- 11 test cases covering tất cả APIs
- Format output đẹp với colors
- Cross-platform (Bash + PowerShell)

**Khi nào dùng**:
- ✅ Quick test APIs mà không cần Postman
- ✅ CI/CD pipelines
- ✅ Automated testing
- ✅ Demo và debugging

**Cách chạy**:
```bash
# Linux/Mac
bash test-api.sh

# Windows PowerShell
.\test-api.ps1
```

---

## 🎯 Use Cases cụ thể

### Use Case 1: Developer mới join project
```
1. Đọc API_DOCUMENTATION.md để hiểu APIs
2. Import postman_collection.json
3. Follow POSTMAN_GUIDE.md để setup
4. Test APIs theo thứ tự recommended
```

### Use Case 2: Test APIs nhanh
```
1. Chạy backend
2. Run test-api.ps1 (Windows) hoặc test-api.sh (Linux/Mac)
3. Xem output để verify
```

### Use Case 3: Share APIs với client/partner
```
1. Publish Postman collection publicly
2. Share API_DOCUMENTATION.md file
3. Send Postman collection link
```

### Use Case 4: Setup CI/CD testing
```
1. Install Newman CLI
2. Add test-api.sh vào CI pipeline
3. Hoặc dùng: newman run postman_collection.json
```

### Use Case 5: Team collaboration
```
1. Create Postman Team Workspace
2. Invite members
3. Sync collection
4. Follow POSTMAN_WORKFLOW.md best practices
```

---

## 📊 Collection Overview

### Tổng số: 19 API Requests

**1. Sensor APIs** (4 requests)
- Get Latest Sensor Data
- Get History - All
- Get History - Filter by Temperature
- Get History - Search

**2. Action History APIs** (8 requests)
- Get Latest Actions
- Get History - All
- Get History - Filter by Device
- Get History - Filter by Status
- Get History - Combined Filters
- Get Device State × 3 (Light, Fan, AC)

**3. Device Control APIs** (6 requests)
- Turn ON/OFF × 3 devices (Light, Fan, AC)

**4. Profile API** (1 request)
- Get Profile

---

## 🌟 Tính năng nổi bật

### 1. Hoàn chỉnh
- ✅ Cover 100% APIs của project
- ✅ Include success & error cases
- ✅ Document tất cả parameters

### 2. Dễ sử dụng
- ✅ Import 1 click
- ✅ Variables pre-configured
- ✅ Descriptions rõ ràng

### 3. Production-ready
- ✅ Environment variables
- ✅ Error handling
- ✅ Best practices

### 4. Extensible
- ✅ Dễ dàng thêm requests mới
- ✅ Support tests automation
- ✅ CI/CD ready

---

## 🔗 Links hữu ích

- **Postman Learning**: https://learning.postman.com/
- **Newman Documentation**: https://github.com/postmanlabs/newman
- **API Design Guide**: https://swagger.io/resources/articles/best-practices-in-api-design/

---

## 📞 Support

**Email**: nnq148@gmail.com  
**GitHub**: https://github.com/nnq148

---

## 🎓 Học thêm

### Postman Basics
1. Collections & Requests
2. Environments & Variables
3. Pre-request Scripts
4. Tests & Assertions

### Postman Advanced
1. Mock Servers
2. API Monitoring
3. Newman CLI
4. CI/CD Integration

### API Documentation Best Practices
1. Clear endpoint naming
2. Comprehensive descriptions
3. Example requests/responses
4. Error documentation
5. Version control

---

## ✅ Checklist hoàn thành

- [x] API Documentation đầy đủ
- [x] Postman Collection với 19 requests
- [x] Import guide chi tiết
- [x] Test scripts (Bash & PowerShell)
- [x] Workflow và best practices
- [x] Examples và use cases
- [x] Troubleshooting guide

---

**Version**: 1.0.0  
**Last Updated**: October 16, 2025  
**Author**: Nguyễn Nhật Quang (B22DCCN645)
