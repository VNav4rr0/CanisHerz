#include "MAX30105.h"
#include "heartRate.h"
#include <WiFiManager.h>  // https://github.com/tzapu/WiFiManager
#include <WiFi.h>
#include <WebServer.h>
#include <Preferences.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"

// URLs para autenticação e Firestore
const char* firestoreURL = "https://firestore.googleapis.com/v1/projects/canisherz-90112/databases/(default)/documents/DispositivosCanis"; 
const char* authURL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCwC1m0YVGMJby97kgtUf6gNZAy2g5XiD0";

WebServer server(80);
Preferences preferences;

// Variáveis do sensor de batimentos cardíacos
const byte RATE_SIZE = 4; 
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0;
float beatsPerMinute;
int beatAvg;
int lastBeatAvg = -1; // Armazena o último valor enviado para Firestore

MAX30105 particleSensor;

// Variáveis de Wi-Fi e autenticação
String idToken = ""; 
String deviceDocID = ""; // Guarda o ID do documento no Firestore

void setupHeartRateSensor() {
  Serial.println("Inicializando sensor de batimentos...");
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30105 não encontrado. Verifique a conexão.");
    while (1);
  }
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0xFF);
  particleSensor.setPulseAmplitudeGreen(0);
  Serial.println("Sensor inicializado com sucesso.");
}

void detectHeartRate() {
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
      }
    }
  } else {
    beatAvg = 0;
  }
}

void authenticateUser() {
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Autenticando usuário...");
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

      Serial.printf("Token de autenticação recebido: %s\n", idToken.c_str());
      checkIfDeviceExists(); // Verifica se o dispositivo já está cadastrado
    } else {
      Serial.printf("Erro ao autenticar: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end();
  } else {
    Serial.println("Erro na conexão Wi-Fi. Autenticação não foi possível.");
  }
}

void checkIfDeviceExists() {
  if (WiFi.status() == WL_CONNECTED && idToken.length() > 0) {
    Serial.println("Verificando se o dispositivo já está cadastrado...");
    HTTPClient http;
    String deviceURL = String(firestoreURL) + "/" + WiFi.macAddress();
    http.begin(deviceURL);
    http.addHeader("Authorization", "Bearer " + idToken);

    int httpResponseCode = http.GET();
    if (httpResponseCode == 200) {
      Serial.println("Dispositivo já cadastrado no Firestore.");
      deviceDocID = deviceURL; // Salva o URL do documento para atualização contínua
    } else if (httpResponseCode == 404) {
      Serial.println("Dispositivo não cadastrado. Enviando dados iniciais...");
      sendInitialDeviceData();
    } else {
      Serial.printf("Erro ao verificar dispositivo: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end();
  }
}

void sendInitialDeviceData() {
  if (WiFi.status() == WL_CONNECTED && idToken.length() > 0) {
    Serial.println("Enviando dados iniciais do dispositivo...");
    HTTPClient http;
    String deviceURL = String(firestoreURL) + "/" + WiFi.macAddress();
    http.begin(deviceURL);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", "Bearer " + idToken);

    DynamicJsonDocument doc(512);
    doc["fields"]["macAddress"]["stringValue"] = WiFi.macAddress();
    doc["fields"]["userID"]["stringValue"] = "";
    doc["fields"]["batteryLevel"]["integerValue"] = 100;
    doc["fields"]["beatsPerMinute"]["integerValue"] = (int)beatsPerMinute;
    doc["fields"]["beatAvg"]["integerValue"] = beatAvg;

    String jsonData;
    serializeJson(doc, jsonData);

    int httpResponseCode = http.PATCH(jsonData);  
    if (httpResponseCode == 200) {
      Serial.println("Dados iniciais enviados com sucesso!");
    } else {
      Serial.printf("Erro ao enviar dados iniciais: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end();
  } else {
    Serial.println("Erro ao enviar dados iniciais. Conexão ou autenticação ausente.");
  }
}

void sendHeartRateData() {
  if (WiFi.status() == WL_CONNECTED && idToken.length() > 0 && !deviceDocID.isEmpty()) {
    Serial.println("Atualizando dados de batimentos cardíacos...");
    HTTPClient http;
    http.begin(deviceDocID + "?updateMask.fieldPaths=beatsPerMinute&updateMask.fieldPaths=beatAvg");
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", "Bearer " + idToken);

    DynamicJsonDocument doc(128);
    doc["fields"]["beatsPerMinute"]["integerValue"] = (int)beatsPerMinute;
    doc["fields"]["beatAvg"]["integerValue"] = beatAvg;

    String jsonData;
    serializeJson(doc, jsonData);

    int httpResponseCode = http.PATCH(jsonData);  
    if (httpResponseCode == 200) {
      Serial.println("Dados de batimentos atualizados com sucesso!");
    } else {
      Serial.printf("Erro ao atualizar dados: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end();
  } else {
    Serial.println("Erro ao atualizar dados. Conexão ou autenticação ausente.");
  }
}

void tryConnectSavedWiFi() {
  WiFiManager wm;
  Serial.println("Tentando conectar ao Wi-Fi...");
  if (!wm.autoConnect("CanisHerz", "12345678")) {
    Serial.println("Falha ao conectar ao Wi-Fi.");
  } else {
    Serial.println("Conectado à rede Wi-Fi.");
    authenticateUser();
  }
}

void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);
  Serial.begin(115200);
  preferences.begin("wifiCreds", false);
  setupHeartRateSensor();
  tryConnectSavedWiFi();
}

void loop() {
  detectHeartRate();

  // Verifica se a média dos batimentos mudou antes de enviar
  if (beatAvg > 0 && beatAvg != lastBeatAvg) {
    sendHeartRateData();
    lastBeatAvg = beatAvg; // Atualiza o valor enviado
  }

  server.handleClient();
}
