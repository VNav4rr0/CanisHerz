#include <WiFi.h>
#include <WebServer.h>
#include <Preferences.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* apSSID = "CanisHerz";
const char* apPassword = "12345678";
const char* firestoreURL = "https://firestore.googleapis.com/v1/projects/canisherz-90112/databases/(default)/documents/DispositivosCanis"; 
const char* authURL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCwC1m0YVGMJby97kgtUf6gNZAy2g5XiD0";

WebServer server(80);
Preferences preferences;

String ssid = "";
String password = "";
bool tryingToConnect = false;
String idToken = ""; 

void handleRoot() {
  String html = "<!DOCTYPE html><html><head><style>";
  html += "body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }";
  html += "form { background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }";
  html += "h1 { color: red; margin-bottom: 20px; text-align: center; }";
  html += "input[type='text'], input[type='password'] { width: 80%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px; }";
  html += "input[type='submit'] { background-color: red; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px; }";
  html += "input[type='submit']:hover { background-color: darkred; }";
  html += "</style></head><body>";
  html += "<form action='/setWiFi' method='POST'>";
  html += "<h1>Configurar Wi-Fi - CanisHerz</h1>";
  html += "SSID: <input type='text' name='ssid'><br>";
  html += "Senha: <input type='password' name='password'><br>";
  html += "<input type='submit' value='Enviar'>";
  html += "</form>";
  html += "</body></html>";
  
  server.send(200, "text/html", html);
}

void handleSetWiFi() {
  ssid = server.arg("ssid");
  password = server.arg("password");
  
  preferences.putString("ssid", ssid);
  preferences.putString("password", password);
  
  server.send(200, "text/html", "<h1 style='color:red;'>Credenciais recebidas. Tentando conectar...</h1>");
  tryingToConnect = true;
}

void handleStatus() {
  String status = (WiFi.status() == WL_CONNECTED) ? "Conectado ao Wi-Fi" : (tryingToConnect ? "Tentando conectar..." : "Aguardando credenciais");
  server.send(200, "text/plain", status);
}

void tryConnectSavedWiFi() {
  String savedSSID = preferences.getString("ssid", "");
  String savedPassword = preferences.getString("password", "");

  if (savedSSID != "") {
    WiFi.begin(savedSSID.c_str(), savedPassword.c_str());
    unsigned long startAttemptTime = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 10000) {
      delay(100);
    }
    if (WiFi.status() != WL_CONNECTED) startAPMode();
    else authenticateUser(); // Autentica o usuário se conectado
  } else {
    startAPMode();
  }
}

void startAPMode() {
  WiFi.mode(WIFI_AP_STA);
  WiFi.softAP(apSSID, apPassword);
  
  server.on("/", handleRoot);
  server.on("/setWiFi", handleSetWiFi);
  server.on("/status", handleStatus);
  server.begin();
}

void authenticateUser() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(authURL);
    http.addHeader("Content-Type", "application/json");

    String jsonData = "{\"returnSecureToken\": true}";
    int httpResponseCode = http.POST(jsonData);
    
    if (httpResponseCode > 0) {
      String payload = http.getString();
      DynamicJsonDocument doc(256);
      deserializeJson(doc, payload);
      idToken = doc["idToken"].as<String>(); // Armazena o token de autenticação

      Serial.printf("Token de autenticação: %s\n", idToken.c_str());
      checkIfDeviceExists(); // Verifica se o dispositivo já está cadastrado
    } else {
      Serial.printf("Erro ao autenticar: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end(); // Libera recursos
  } else {
    Serial.println("Erro na conexão Wi-Fi.");
  }
}

void checkIfDeviceExists() {
  if (WiFi.status() == WL_CONNECTED && idToken.length() > 0) {
    HTTPClient http;
    String deviceURL = String(firestoreURL) + "?where=macAddress=='" + WiFi.macAddress() + "'";
    http.begin(deviceURL);
    http.addHeader("Authorization", "Bearer " + idToken);

    int httpResponseCode = http.GET();
    if (httpResponseCode > 0) {
      String payload = http.getString();
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, payload);

      if (doc["documents"].size() > 0) {
        Serial.println("Dispositivo já cadastrado no Firestore.");
      } else {
        sendDeviceData(); // Envia os dados se o dispositivo não estiver cadastrado
      }
    } else {
      Serial.printf("Erro ao verificar dispositivo: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end();
  }
}

void sendDeviceData() {
  if (WiFi.status() == WL_CONNECTED && idToken.length() > 0) {
    HTTPClient http;
    http.begin(firestoreURL);

    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", "Bearer " + idToken); // Usa o token de autenticação

    String macAddress = WiFi.macAddress();
    String batteryLevel = "100"; // Exemplo de nível da bateria
    String timestamp = String(millis()); // Usar o tempo de execução como timestamp

    DynamicJsonDocument doc(256);
    doc["fields"]["macAddress"]["stringValue"] = macAddress;
    doc["fields"]["batteryLevel"]["integerValue"] = batteryLevel.toInt();
    doc["fields"]["timestamp"]["integerValue"] = timestamp.toInt();
    doc["fields"]["userID"]["stringValue"] = ""; // Campo userID vazio

    String jsonData;
    serializeJson(doc, jsonData);

    // Envia a solicitação POST ao Firestore
    int httpResponseCode = http.POST(jsonData);
    if (httpResponseCode > 0) {
      Serial.printf("Código de resposta: %d\n", httpResponseCode);
    } else {
      Serial.printf("Erro ao enviar: %s\n", http.errorToString(httpResponseCode).c_str());
    }
    
    http.end(); // Libera recursos
  } else {
    Serial.println("Erro na conexão Wi-Fi ou token inválido.");
  }
}

void setup() {
  Serial.begin(115200);
  preferences.begin("wifiCreds", false);
  tryConnectSavedWiFi();
}

void loop() {
  server.handleClient();
  
  if (tryingToConnect && WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid.c_str(), password.c_str());
    unsigned long startAttemptTime = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 10000) {
      delay(100);
    }
    if (WiFi.status() == WL_CONNECTED) {
      authenticateUser(); // Autentica o usuário se conectado
      tryingToConnect = false;
    }
  }
}
