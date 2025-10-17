# Backend - Dự án IoT

Backend server cho hệ thống IoT monitoring và control.

## Cài đặt

```bash
npm install
```

## Chạy server

```bash
# Production
npm start

# Development với nodemon
npm run dev
```

## API Documentation

📚 **Full API Documentation**: Xem file [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)

🚀 **Postman Collection**: Import file [`postman_collection.json`](./postman_collection.json)

📖 **Postman Guide**: Xem hướng dẫn chi tiết trong [`POSTMAN_GUIDE.md`](./POSTMAN_GUIDE.md)

### Quick API Reference

#### Sensor APIs
- `GET /api/sensors/latest` - Dữ liệu cảm biến mới nhất
- `GET /api/sensors/history` - Lịch sử dữ liệu cảm biến (có filter & search)

#### Action APIs
- `GET /api/actions/history` - Lịch sử hành động (có filter & search)
- `GET /api/actions/latest` - Trạng thái mới nhất của tất cả thiết bị
- `GET /api/actions/state/:device` - Trạng thái của một thiết bị cụ thể

#### Control API
- `POST /api/control` - Điều khiển thiết bị (bật/tắt LED)

#### Other
- `GET /api/profile` - Thông tin sinh viên và links
- `GET /health` - Health check

### Socket.IO Events
- `sensor-data` - Realtime sensor data từ ESP32
- `action-update` - Thông báo khi có thiết bị được điều khiển
- `device-status` - Phản hồi trạng thái thiết bị từ ESP32

## Environment Variables

Tạo file `.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=iotdb
MQTT_SERVER=f12034700b2d452b8de9508ddec28f11.s1.eu.hivemq.cloud
MQTT_PORT=8883
MQTT_USERNAME=nnq148
MQTT_PASSWORD=Quang2004
```
