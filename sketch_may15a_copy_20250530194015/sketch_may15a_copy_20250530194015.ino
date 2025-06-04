#include <string.h>
#include <WiFi.h>
#include <WebSocketsClient.h>

const char* ssid = "Nhà.";
const char* password = "";
const int sw420Pin = 25;
const int sw540Pin = 26;
const int buzzerPin = 33;
const int ledPin = 2;

int sw420State = 0;
int sw420OldState = 0;
int sw540State = 0;
int sw540OldState = 0;

int sync_buzzerTone = 0;

WebSocketsClient webSocket;

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
      break;
    case WStype_TEXT:
      Serial.println("Command: " + message);

      if (message == "ON_LED")
        digitalWrite(ledPin, HIGH);
      else if (message == "OFF_LED")
        digitalWrite(ledPin, LOW);
      else if (message == "ON_SOUND")
        tone(buzzerPin, sync_buzzerTone);
      else if (message == "OFF_SOUND")
        noTone(buzzerPin);
      else if (strcmp(param1, "BUZZER_TONE") == 0)
        sync_buzzerTone = param2;
      else if (strcmp(param1, "SYNC_LED") == 0)
        digitalWrite(ledPin, param2);
      else if (strcmp(param1, "SYNC_BUZZER") == 0)
        digitalWrite(buzzerPin, param2);
      else if (strcmp(param1, "SYNC_BUZZER_TONE") == 0)
        sync_buzzerTone = param2;
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
  pinMode(ledPin, OUTPUT);
  pinMode(sw420Pin, INPUT_PULLDOWN);
  pinMode(sw540Pin, INPUT_PULLDOWN);
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
}

void loop() {
  webSocket.loop();

  sw420State = digitalRead(sw420Pin);
  sw540State = digitalRead(sw540Pin);

  if (sw420State != sw420OldState) {
    sw420OldState = sw420State;
    webSocket.sendTXT(String("SW420|") + sw420State);
  }

  if (sw540State != sw540OldState) {
    sw540OldState = sw540State;
    webSocket.sendTXT(String("SW540|") + sw540State);
  }
}