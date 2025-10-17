# Frontend - IoT Dashboard

React frontend cho hệ thống IoT Dashboard.

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

```bash
npm start
```

Mở [http://localhost:3000](http://localhost:3000) để xem giao diện.

## Build production

```bash
npm run build
```

## Cấu trúc

```
src/
├── components/      # Reusable components
├── pages/          # Page components
├── services/       # API và Socket.IO services
├── App.js          # Main router
└── index.js        # Entry point
```

## Tính năng

- Dashboard với realtime monitoring
- Biểu đồ dữ liệu cảm biến
- Điều khiển thiết bị
- Lịch sử dữ liệu và hành động
- Profile page
