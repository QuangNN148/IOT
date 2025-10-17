# API Architecture & Flow Diagram

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     IoT Smart Home System                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐      MQTT (HiveMQ)      ┌──────────────────────┐
│   ESP32      │◄────────────────────────►│   Node.js Backend   │
│  Hardware    │  IoT/Sensor/data         │   (Express.js)      │
│              │  IoT/Control/led1-3      │                      │
│ • DHT11      │  IoT/Status/led1-3       │ • MQTT Service      │
│ • Light Sensor│ IoT/Request/state       │ • Socket.IO         │
│ • 3 LEDs     │  IoT/Response/state      │ • MySQL DB          │
└──────────────┘                           └──────────┬───────────┘
                                                      │
                                              HTTP REST API
                                              Socket.IO Events
                                                      │
                                           ┌──────────▼───────────┐
                                           │   React Frontend     │
                                           │                      │
                                           │ • Dashboard (Home)   │
                                           │ • Data Sensors       │
                                           │ • Action History     │
                                           │ • Profile            │
                                           └──────────────────────┘
```

---

## 🔄 API Request Flow

### 1. Sensor Data Flow (Read)

```
ESP32 Sensors → MQTT Publish → Backend MQTT Service
                                        ↓
                              Store to MySQL Database
                                        ↓
                              Emit Socket.IO Event
                                        ↓
                              Frontend Receives → Update UI
```

**APIs Involved:**
- `GET /api/sensors/latest` - Get latest sensor data
- `GET /api/sensors/history` - Get historical data
- Socket.IO: `sensor-data` event

---

### 2. Device Control Flow (Write)

```
Frontend UI → POST /api/control → Backend Controller
                                        ↓
                              Store to MySQL Database
                                        ↓
                              Publish MQTT Message
                                        ↓
                         ESP32 Receives → Control LED
                                        ↓
                         ESP32 Feedback → MQTT Status
                                        ↓
                    Backend → Socket.IO Emit → Frontend Update
```

**APIs Involved:**
- `POST /api/control` - Control device
- `GET /api/actions/latest` - Get device states
- `GET /api/actions/state/:device` - Get specific device state
- Socket.IO: `action-update`, `device-status` events

---

## 📊 Database Schema

```
┌──────────────────────────────────────────┐
│           sensors_data                   │
├──────────────────────────────────────────┤
│ id (PK)        │ INT AUTO_INCREMENT      │
│ temperature    │ FLOAT                   │
│ humidity       │ FLOAT                   │
│ light          │ INT                     │
│ timestamp      │ DATETIME                │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│         action_history                   │
├──────────────────────────────────────────┤
│ id (PK)        │ INT AUTO_INCREMENT      │
│ device         │ VARCHAR(50)             │
│ action         │ VARCHAR(10)             │
│ created_at     │ DATETIME                │
└──────────────────────────────────────────┘
```

---

## 🛣️ API Endpoints Map

```
API Base URL: http://localhost:5000/api

📊 SENSOR APIS
├── GET  /sensors/latest
│   └── Get most recent sensor reading
│
└── GET  /sensors/history
    ├── ?search=keyword          (search filter)
    ├── ?dataType=temp|hum|light (data type filter)
    ├── ?sortBy=timestamp        (sorting)
    ├── ?sortOrder=DESC          (order)
    └── ?limit=100               (limit results)

📝 ACTION HISTORY APIS
├── GET  /actions/latest
│   └── Get latest state of all devices
│
├── GET  /actions/history
│   ├── ?search=keyword             (search filter)
│   ├── ?dataType=device|action     (data type filter)
│   ├── ?deviceFilter=Light|Fan|AC  (device filter)
│   ├── ?actionFilter=ON|OFF        (status filter)
│   └── ?limit=100                  (limit results)
│
└── GET  /actions/state/:device
    └── Get current state of specific device

🎮 DEVICE CONTROL API
└── POST /control
    └── Body: { "device": "led1", "action": "on" }

👤 PROFILE API
└── GET  /profile
    └── Get student info and links
```

---

## 🔌 Socket.IO Events

```
Server → Client Events:

📊 sensor-data
   Emitted when: New sensor data from ESP32
   Data: {
     temperature: Number,
     humidity: Number,
     light: Number,
     timestamp: String
   }

⚡ action-update
   Emitted when: Device is controlled
   Data: {
     device: String,
     action: String,
     timestamp: String
   }

🔋 device-status
   Emitted when: ESP32 sends status feedback
   Data: {
     device: String,
     status: String,
     timestamp: String
   }
```

---

## 🌊 Complete User Flow Example

### Scenario: User turns ON the light

```
1. User clicks "Light ON" button in React Frontend
   ↓
2. Frontend sends: POST /api/control
   Body: { "device": "led1", "action": "on" }
   ↓
3. Backend Controller receives request
   ↓
4. Backend saves to database (action_history table)
   INSERT: device='Light', action='on', created_at=NOW()
   ↓
5. Backend publishes MQTT message
   Topic: IoT/Control/led1
   Payload: "on"
   ↓
6. ESP32 receives MQTT message
   ↓
7. ESP32 turns ON LED (GPIO pin HIGH)
   ↓
8. ESP32 publishes status feedback
   Topic: IoT/Status/led1
   Payload: { "device": "led1", "status": "on" }
   ↓
9. Backend receives MQTT status
   ↓
10. Backend emits Socket.IO event
    Event: 'action-update'
    Data: { device: 'Light', action: 'on', timestamp: '...' }
    ↓
11. Frontend receives Socket.IO event
    ↓
12. Frontend updates UI (button shows "ON" state)
```

---

## 📦 Postman Collection Structure

```
IoT Project API Collection
│
├── 📁 1. Sensor APIs (4 requests)
│   ├── 📄 Get Latest Sensor Data
│   ├── 📄 Get Sensor History - All Data
│   ├── 📄 Get Sensor History - Filter by Temperature
│   └── 📄 Get Sensor History - Search by Keyword
│
├── 📁 2. Action History APIs (8 requests)
│   ├── 📄 Get Latest Actions
│   ├── 📄 Get Action History - All Actions
│   ├── 📄 Get Action History - Filter by Device (Light)
│   ├── 📄 Get Action History - Filter by Status (ON)
│   ├── 📄 Get Action History - Combined Filters
│   ├── 📄 Get Device State - Light
│   ├── 📄 Get Device State - Fan
│   └── 📄 Get Device State - Air Condition
│
├── 📁 3. Device Control APIs (6 requests)
│   ├── 📄 Turn ON Light
│   ├── 📄 Turn OFF Light
│   ├── 📄 Turn ON Fan
│   ├── 📄 Turn OFF Fan
│   ├── 📄 Turn ON Air Condition
│   └── 📄 Turn OFF Air Condition
│
└── 📁 4. Profile API (1 request)
    └── 📄 Get Profile
```

---

## 🔐 Security & Error Handling

```
API Request → Backend Middleware
                    ↓
            Validation Layer
            • Check required fields
            • Validate data types
            • Sanitize inputs
                    ↓
            Business Logic
            • Process request
            • Database operations
            • MQTT publishing
                    ↓
            Error Handling
            • Try-catch blocks
            • Error responses
            • Logging
                    ↓
            Response Format
            {
              "success": true/false,
              "data": {...},
              "message": "error message"
            }
```

---

## 🚀 Deployment Architecture

```
Development Environment:
├── Backend: localhost:5000
├── Frontend: localhost:3000
├── MySQL: localhost:3306
└── MQTT: HiveMQ Cloud (remote)

Production Environment:
├── Backend: Deployed on cloud (Heroku/Railway/Render)
├── Frontend: Deployed on Vercel/Netlify
├── MySQL: Cloud database (PlanetScale/Railway)
└── MQTT: HiveMQ Cloud (same)
```

---

## 📈 Performance Considerations

```
Optimization Strategies:

1. Database Queries
   • Use indexes on timestamp columns
   • Implement pagination (LIMIT/OFFSET)
   • Cache frequently accessed data

2. Real-time Updates
   • Socket.IO for instant UI updates
   • Reduce API polling
   • Efficient event handling

3. API Response
   • Return only necessary fields
   • Implement query filters
   • Compress responses (gzip)

4. MQTT Messages
   • QoS level 1 (at least once delivery)
   • Keep payload small
   • Use binary format when possible
```

---

**This diagram helps visualize the complete system architecture and API flows!**
