#include <WiFi.h>
#include <WebSocketsClient.h>

const char* ssid = "Phuong Minh 1";
const char* password = "Vu124689@";
const int sw420Pin = 25;
const int sw540Pin = 26;

WebSocketsClient webSocket;

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  String message = String((char*)payload);
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("Disconnected from server");
      break;
    case WStype_CONNECTED:
      Serial.println("Connected to server");
      break;
    case WStype_TEXT:
      Serial.println("Command: " + message);

      if (message == "ON_LEDBI") {
        digitalWrite(2, HIGH);
      } else if (message == "OFF_LEDBI") {
        digitalWrite(2, LOW);
      }
      break;
    case WStype_BIN:
      Serial.println("Server command cant handle");
      break;
    default:
      break;
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(2, OUTPUT);
  pinMode(sw420Pin, INPUT_PULLDOWN);
  pinMode(sw540Pin, INPUT_PULLDOWN);

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
}

void loop() {
  webSocket.loop();
  Serial.print(digitalRead(sw420Pin));
  Serial.print(", ");
  Serial.println(digitalRead(sw540Pin));
}
