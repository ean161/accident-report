#include <WiFi.h>

// Thay thông tin Wi-Fi tại đây
const char* ssid = "TenWiFi";
const char* password = "MatKhauWiFi";

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("Dang ket noi WiFi...");
  WiFi.begin(ssid, password);

  int retryCount = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    retryCount++;
    if (retryCount > 20) { // sau 10 giây thì dừng lại
      Serial.println("\nKhong ket noi duoc WiFi.");
      return;
    }
  }

  Serial.println("\nDa ket noi WiFi!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Có thể thêm code sử dụng Wi-Fi ở đây (gửi HTTP, MQTT, v.v.)
}
