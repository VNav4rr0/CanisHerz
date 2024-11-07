#include <WiFi.h>
#include <WebServer.h>
#include <Preferences.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "MAX30105.h"
#include "heartRate.h"

// Configurações de rede e URLs
const char* apSSID = "CanisHerz";
const char* apPassword = "12345678";
const char* firestoreURL = "https://firestore.googleapis.com/v1/projects/canisherz-90112/databases/(default)/documents/DispositivosCanis"; 
const char* authURL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCwC1m0YVGMJby97kgtUf6gNZAy2g5XiD0";

WebServer server(80);
Preferences preferences;
MAX30105 particleSensor;

String ssid = "";
String password = "";
bool tryingToConnect = false;
String idToken = ""; 
String deviceDocID = "";

// Variáveis do sensor de batimentos cardíacos
const byte RATE_SIZE = 4; 
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0;
float beatsPerMinute;
int beatAvg;

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
    
    if (WiFi.status() != WL_CONNECTED) {
      startAPMode();
    } else {
      authenticateUser();
    }
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

  Serial.println("Modo AP iniciado. Conecte-se ao ponto de acesso para configurar o Wi-Fi.");
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
      idToken = doc["idToken"].as<String>();

      Serial.printf("Token de autenticação: %s\n", idToken.c_str());
      checkIfDeviceExists();
    } else {
      Serial.printf("Erro ao autenticar: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end();
  } else {
    Serial.println("Erro na conexão Wi-Fi.");
  }
}

void checkIfDeviceExists() {
  if (WiFi.status() == WL_CONNECTED && idToken.length() > 0) {
    HTTPClient http;
    String deviceURL = String(firestoreURL) + "/" + WiFi.macAddress();
    http.begin(deviceURL);
    http.addHeader("Authorization", "Bearer " + idToken);

    int httpResponseCode = http.GET();
    if (httpResponseCode == 200) {
      Serial.println("Dispositivo já cadastrado no Firestore.");
      deviceDocID = deviceURL;
    } else if (httpResponseCode == 404) {
      sendDeviceData();
    } else {
      Serial.printf("Erro ao verificar dispositivo: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end();
  }
}

void sendDeviceData() {
  if (WiFi.status() == WL_CONNECTED && idToken.length() > 0) {
    HTTPClient http;
    String deviceURL = String(firestoreURL) + "/" + WiFi.macAddress();
    http.begin(deviceURL);
    
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", "Bearer " + idToken); 

    String macAddress = WiFi.macAddress();
    String batteryLevel = "100"; 

    // Obtenha o JSON atual do Firestore para verificar o valor do userID
    DynamicJsonDocument doc(256);
    int httpResponseCode = http.GET(); // Obtenha os dados existentes do dispositivo
    if (httpResponseCode == 200) {
      String payload = http.getString();
      deserializeJson(doc, payload);
      String userID = doc["fields"]["userID"]["stringValue"].as<String>();

      // Só preenche o userID se estiver vazio
      if (userID == "") {
        doc["fields"]["userID"]["stringValue"] = "";  // Preencher com valor vazio ou o ID do usuário, se necessário
      }

      doc["fields"]["macAddress"]["stringValue"] = macAddress;
      doc["fields"]["batteryLevel"]["integerValue"] = batteryLevel.toInt();
      doc["fields"]["beatsPerMinute"]["integerValue"] = (int)beatsPerMinute;
      doc["fields"]["beatAvg"]["integerValue"] = beatAvg;

      String jsonData;
      serializeJson(doc, jsonData);

      int patchResponseCode = http.PATCH(jsonData);  // Enviar dados atualizados
      if (patchResponseCode > 0) {
        Serial.printf("Código de resposta: %d\n", patchResponseCode);
      } else {
        Serial.printf("Erro ao enviar: %s\n", http.errorToString(patchResponseCode).c_str());
      }
    } else {
      Serial.printf("Erro ao recuperar dados: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end();
  } else {
    Serial.println("Erro ao atualizar dados ou token inválido.");
  }
}


void setup() {
  Serial.begin(115200);
  preferences.begin("wifiCreds", false);
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30105 não encontrado. Verifique a conexão.");
    while (1);
  }
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0xFF);
  particleSensor.setPulseAmplitudeGreen(0);
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
      authenticateUser();
      tryingToConnect = false;
    }
  }

  long irValue = particleSensor.getIR();
  
  if (irValue > 5000) { 
    if (checkForBeat(irValue)) {
      long delta = millis() - lastBeat;
      lastBeat = millis();

      beatsPerMinute = 60 / (delta / 1000.0);
      
      if (beatsPerMinute < 200 && beatsPerMinute > 40) {  
        rates[rateSpot++] = (byte)beatsPerMinute;
        rateSpot %= RATE_SIZE;

        beatAvg = 0;
        for (byte x = 0; x < RATE_SIZE; x++) beatAvg += rates[x];
        beatAvg /= RATE_SIZE;

        Serial.printf("BPM: %.1f, Média: %d\n", beatsPerMinute, beatAvg);
        sendDeviceData();
      }
    }
  } else {
    beatAvg = 0;
  }
}