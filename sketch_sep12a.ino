#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "DHT.h"

#define DHTTYPE DHT11

const char* ssid = "realms c15";
const char* password = "123456789";
const char* mqtt_server = "f12034700b2d452b8de9508ddec28f11.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;

// Thông tin xác thực MQTT
const char* mqtt_username = "nnq148";
const char* mqtt_password = "Quang2004";

WiFiClientSecure espClient;
PubSubClient client(espClient);

const int DHTPin = 25;
const int led1 = 13;
const int led2 = 14;
const int led3 = 27;
const int lightPin = 34;

DHT dht(DHTPin, DHTTYPE);

long lastTime = 0;
long interval = 5000;

// Bỏ qua xác thực SSL certificate

// ================= WIFI =================
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\n✅ WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

// ================= CALLBACK MQTT =================
void callback(char* topic, byte* message, unsigned int length) {
  String msg;
  for (unsigned int i = 0; i < length; i++) {
    msg += (char)message[i];
  }
  
  Serial.print("📩 Topic: ");
  Serial.print(topic);
  Serial.print(" | Message: ");
  Serial.println(msg);
  
  // Xử lý tin nhắn điều khiển LED
  if (String(topic) == "Control/led") {
    if (msg == "onled1") { 
      digitalWrite(led1, HIGH); 
      Serial.println("💡 LED1 ON");
      // Gửi phản hồi xác nhận
      client.publish("Status/led1", "ON");
    }
    else if (msg == "offled1") { 
      digitalWrite(led1, LOW); 
      Serial.println("💡 LED1 OFF");
      client.publish("Status/led1", "OFF");
    }
    else if (msg == "onled2") { 
      digitalWrite(led2, HIGH); 
      Serial.println("💡 LED2 ON");
      client.publish("Status/led2", "ON");
    }
    else if (msg == "offled2") { 
      digitalWrite(led2, LOW); 
      Serial.println("💡 LED2 O FF");
      client.publish("Status/led2", "OFF");
    }
    else if (msg == "onled3") { 
      digitalWrite(led3, HIGH); 
      Serial.println("💡 LED3 ON");
      client.publish("Status/led3", "ON");
    }
    else if (msg == "offled3") { 
      digitalWrite(led3, LOW); 
      Serial.println("💡 LED3 OFF");
      client.publish("Status/led3", "OFF");
    }
  }
}

// ================= RECONNECT MQTT =================
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32Client-" + String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("✅ MQTT connected");
      // Subscribe vào topic điều khiển
      client.subscribe("Control/led");
      Serial.println("📡 Subscribed to Control/led");
    } else {
      Serial.print("❌ failed, rc=");
      Serial.print(client.state());
      Serial.println(" => retry in 5s");
      delay(5000);
    }
  }
}

// ================= SETUP =================
void setup() {
  // Thiết lập chân LED
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(led3, OUTPUT);
  
  // Tắt tất cả LED ban đầu
  digitalWrite(led1, LOW);
  digitalWrite(led2, LOW);
  digitalWrite(led3, LOW);
  
  Serial.begin(115200);
  dht.begin();
  
  setup_wifi();
  
  // Bỏ qua xác thực SSL certificate (không an toàn cho production)
  espClient.setInsecure();
  
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  client.setKeepAlive(60);
}

// ================= LOOP =================
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  long now = millis();
  if (now - lastTime > interval) {
    lastTime = now;
    
    float hum = dht.readHumidity();
    float temp = dht.readTemperature();
    if (isnan(hum) || isnan(temp)) {
      Serial.println("⚠️ Failed to read from DHT sensor!");
      return;
    }
    
    int light = analogRead(lightPin);
    light = map(light, 0, 4095, 1000, 0);
    String payload = String(temp) + "," + String(hum) + "," + String(light);
    client.publish("sensors/data", payload.c_str());
    
    Serial.print("🌡 Temp: "); Serial.print(temp); Serial.println(" °C");
    Serial.print("💧 Hum: "); Serial.print(hum); Serial.println(" %");
    Serial.print("💡 Light: "); Serial.println(light);
  }
}