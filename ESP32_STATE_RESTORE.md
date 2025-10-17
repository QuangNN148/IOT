# Hướng dẫn ESP32 - Giữ trạng thái thiết bị khi reconnect

## 📝 Tổng quan

Khi ESP32 ngắt kết nối và kết nối lại, nó cần:
1. **Request trạng thái** từ backend
2. **Nhận response** với trạng thái ON/OFF của tất cả LED
3. **Áp dụng trạng thái** vào hardware

## 🔧 Cài đặt trên ESP32

### 1. Topics cần sử dụng

```cpp
// Topics hiện tại
#define TOPIC_SENSORS "sensors/data"
#define TOPIC_CONTROL "Control/led"
#define TOPIC_STATUS_LED1 "Status/led1"
#define TOPIC_STATUS_LED2 "Status/led2"
#define TOPIC_STATUS_LED3 "Status/led3"

// Topics MỚI cho state restore
#define TOPIC_REQUEST_STATE "Request/state"
#define TOPIC_RESPONSE_STATE "Response/state"
```

### 2. Biến lưu trạng thái

```cpp
// Biến lưu trạng thái LED
bool led1State = false;
bool led2State = false;
bool led3State = false;

// Định nghĩa chân LED
#define LED1_PIN 2
#define LED2_PIN 4
#define LED3_PIN 5
```

### 3. Code trong hàm callback MQTT

```cpp
void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  // Xử lý nhận trạng thái từ backend
  if (String(topic) == TOPIC_RESPONSE_STATE) {
    Serial.println("🔄 Nhận trạng thái từ backend: " + message);
    
    // Parse: "ON,OFF,ON" hoặc "OFF,ON,OFF"
    int firstComma = message.indexOf(',');
    int secondComma = message.indexOf(',', firstComma + 1);
    
    String state1 = message.substring(0, firstComma);
    String state2 = message.substring(firstComma + 1, secondComma);
    String state3 = message.substring(secondComma + 1);
    
    // Áp dụng trạng thái
    led1State = (state1 == "ON");
    led2State = (state2 == "ON");
    led3State = (state3 == "ON");
    
    digitalWrite(LED1_PIN, led1State ? HIGH : LOW);
    digitalWrite(LED2_PIN, led2State ? HIGH : LOW);
    digitalWrite(LED3_PIN, led3State ? HIGH : LOW);
    
    Serial.println("✅ Đã khôi phục trạng thái:");
    Serial.println("  LED1: " + String(led1State ? "ON" : "OFF"));
    Serial.println("  LED2: " + String(led2State ? "ON" : "OFF"));
    Serial.println("  LED3: " + String(led3State ? "ON" : "OFF"));
    
    return;
  }
  
  // Xử lý điều khiển từ backend (code cũ)
  if (String(topic) == TOPIC_CONTROL) {
    Serial.println("📥 Nhận lệnh: " + message);
    
    if (message == "onled1") {
      led1State = true;
      digitalWrite(LED1_PIN, HIGH);
      client.publish(TOPIC_STATUS_LED1, "ON");
      Serial.println("✅ LED1 ON");
    }
    else if (message == "offled1") {
      led1State = false;
      digitalWrite(LED1_PIN, LOW);
      client.publish(TOPIC_STATUS_LED1, "OFF");
      Serial.println("✅ LED1 OFF");
    }
    else if (message == "onled2") {
      led2State = true;
      digitalWrite(LED2_PIN, HIGH);
      client.publish(TOPIC_STATUS_LED2, "ON");
      Serial.println("✅ LED2 ON");
    }
    else if (message == "offled2") {
      led2State = false;
      digitalWrite(LED2_PIN, LOW);
      client.publish(TOPIC_STATUS_LED2, "OFF");
      Serial.println("✅ LED2 OFF");
    }
    else if (message == "onled3") {
      led3State = true;
      digitalWrite(LED3_PIN, HIGH);
      client.publish(TOPIC_STATUS_LED3, "ON");
      Serial.println("✅ LED3 ON");
    }
    else if (message == "offled3") {
      led3State = false;
      digitalWrite(LED3_PIN, LOW);
      client.publish(TOPIC_STATUS_LED3, "OFF");
      Serial.println("✅ LED3 OFF");
    }
  }
}
```

### 4. Code khi MQTT connect/reconnect

```cpp
void reconnect() {
  while (!client.connected()) {
    Serial.print("🔄 Đang kết nối MQTT...");
    
    if (client.connect("ESP32Client", mqtt_username, mqtt_password)) {
      Serial.println("✅ Đã kết nối!");
      
      // Subscribe topics
      client.subscribe(TOPIC_CONTROL);
      client.subscribe(TOPIC_RESPONSE_STATE);
      Serial.println("📡 Đã subscribe topics");
      
      // REQUEST TRẠNG THÁI TỪ BACKEND
      client.publish(TOPIC_REQUEST_STATE, "REQUEST");
      Serial.println("📤 Đã request trạng thái từ backend");
      
    } else {
      Serial.print("❌ Lỗi, rc=");
      Serial.print(client.state());
      Serial.println(" thử lại sau 5s");
      delay(5000);
    }
  }
}
```

### 5. Code trong setup()

```cpp
void setup() {
  Serial.begin(115200);
  
  // Cấu hình chân LED
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(LED3_PIN, OUTPUT);
  
  // Tắt tất cả LED ban đầu
  digitalWrite(LED1_PIN, LOW);
  digitalWrite(LED2_PIN, LOW);
  digitalWrite(LED3_PIN, LOW);
  
  // Kết nối WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi connected");
  
  // Cấu hình MQTT
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}
```

## 🔄 Flow hoạt động

```
ESP32 Connect/Reconnect
    |
    v
Subscribe topics (Control/led, Response/state)
    |
    v
Publish "REQUEST" to "Request/state"
    |
    v
Backend nhận request
    |
    v
Backend query database (getDeviceState)
    |
    v
Backend publish "ON,OFF,ON" to "Response/state"
    |
    v
ESP32 nhận message
    |
    v
ESP32 parse và áp dụng trạng thái
    |
    v
LED1=ON, LED2=OFF, LED3=ON
    |
    v
✅ Trạng thái đã được khôi phục!
```

## 📊 Format message

### Request State (ESP32 → Backend)
- **Topic**: `Request/state`
- **Message**: `"REQUEST"` (hoặc bất kỳ string nào)

### Response State (Backend → ESP32)
- **Topic**: `Response/state`
- **Message**: `"<LED1_STATE>,<LED2_STATE>,<LED3_STATE>"`
- **Ví dụ**: 
  - `"ON,ON,OFF"` - LED1 ON, LED2 ON, LED3 OFF
  - `"OFF,OFF,OFF"` - Tất cả OFF
  - `"ON,OFF,ON"` - LED1 ON, LED2 OFF, LED3 ON

## ✅ Backend đã sẵn sàng!

Backend đã được cập nhật với:
1. ✅ API endpoint: `GET /api/actions/state/:device`
2. ✅ MQTT subscribe: `Request/state`
3. ✅ MQTT publish: `Response/state`
4. ✅ Database query: `getDeviceState(device)`

## 🧪 Test

1. **Bật LED1 từ frontend**
2. **Ngắt kết nối ESP32** (tắt nguồn)
3. **Kết nối lại ESP32**
4. **Kiểm tra**: LED1 vẫn sáng ✅

## 📝 Notes

- Backend lưu tất cả action vào database `action_history`
- Khi ESP32 request, backend sẽ query trạng thái cuối cùng
- Nếu chưa có lịch sử, mặc định là OFF
- Frontend cũng load trạng thái từ backend khi mở trang
