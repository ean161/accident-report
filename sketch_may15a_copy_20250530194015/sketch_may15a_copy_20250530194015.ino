#include <string.h>
#include <WiFi.h>
#include <WebSocketsClient.h>
#include <Wire.h>
#include <HTTPClient.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_ADXL345_U.h>

const char* ssid = "Nnq";
const char* password = "25012005";
const int buzzerPin = 27;
const int ledPin = 2;
const int sync_buzzerTone = 1000;

float lastAccel = 0;
float shakeThreshold = 50;


WebSocketsClient webSocket;
Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(12345);

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  String message = String((char*)payload);

  int separatorIndex = message.indexOf('|');

  char param1[50];
  int param2;

  if (separatorIndex != -1) {
    String firstPart = message.substring(0, separatorIndex);
    String secondPart = message.substring(separatorIndex + 1);

    firstPart.toCharArray(param1, sizeof(param1));

    param2 = secondPart.toInt();
  }


  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("Disconnected from server");
      break;
    case WStype_CONNECTED:
      Serial.println("Connected to server");
      webSocket.sendTXT("CIRCUIT_DEVICE_CONNECTED");

      while (true) {
        String ip = getPublicIP();
        Serial.println(String("IP result: ") + ip);
        if (ip == "ERROR") {
          delay(1000);
          continue;
        }

        webSocket.sendTXT(String("CIRCUIT_IP|") + ip);
        break;
      }
      break;
    case WStype_TEXT:
      Serial.println("Command: " + message);

      if (message == "ON_LED")
        digitalWrite(ledPin, HIGH);
      else if (message == "OFF_LED")
        digitalWrite(ledPin, LOW);
      else if (message == "ON_SOUND")
        tone(buzzerPin, sync_buzzerTone);
      else if (message == "OFF_SOUND") {
        noTone(buzzerPin);
      } else if (message == "CHECK_CIRCUIT_CONNECTED") {
        webSocket.sendTXT("CHECK_CIRCUIT_CONNECTED_RESPONSE");
      } else if (strcmp(param1, "THRESHOLD_LEVEL") == 0 || strcmp(param1, "SYNC_THRESHOLD_LEVEL") == 0)
        shakeThreshold = param2;
      else if (strcmp(param1, "SYNC_LED") == 0)
        digitalWrite(ledPin, param2);
      else if (strcmp(param1, "SYNC_BUZZER") == 0)
        // digitalWrite(buzzerPin, param2);
        if (param2 == 0)
          noTone(buzzerPin);
        else
          tone(buzzerPin, sync_buzzerTone);
      else if (message == "VEHICLE_COLLISION") {
        for (int i = 0; i <= 5; i++) {
          if (i % 2 == 0)
            tone(buzzerPin, sync_buzzerTone);
          else
            noTone(buzzerPin);
          delay(500);
        }
      }
      break;
  }
}

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to wiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  
  webSocket.begin("160.187.246.117", 8070, "/");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);

  if (!accel.begin()) {
    Serial.println("ADXL345 not found");
    while (1);
  }
  accel.setRange(ADXL345_RANGE_2_G);

  digitalWrite(ledPin, HIGH);
  delay(3000);
  digitalWrite(ledPin, LOW);
}

void loop() {
  webSocket.loop();
  sensors_event_t event;
  accel.getEvent(&event);

  float ax = event.acceleration.x;
  float ay = event.acceleration.y;
  float az = event.acceleration.z;

  float currentAccel = sqrt(ax * ax + ay * ay + az * az);
  float delta = abs(currentAccel - lastAccel);

  if (delta > shakeThreshold) {
    Serial.println("THRESHOLD event");
    webSocket.sendTXT("THRESHOLD");
    webSocket.sendTXT(String("TRS LV") + shakeThreshold);
  }

  lastAccel = currentAccel;
}

String getPublicIP() {
  HTTPClient http;
  http.begin("http://api.ipify.org");
  int httpCode = http.GET();

  if (httpCode > 0) {
    String ip = http.getString();
    http.end();
    return ip;
  } else {
    http.end();
    return "ERROR";
  }
}