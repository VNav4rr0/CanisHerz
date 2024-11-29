import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, Modal, SafeAreaView, Animated, Alert, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Provider, IconButton, Card, Icon, Portal, Dialog, SegmentedButtons, List } from 'react-native-paper';
import { firestore, auth } from './firebaseConfig';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const HomeRoute = () => {
  const customTheme = {
    colors: {
      primary: "rgb(180, 39, 31)",
      onPrimary: "rgb(255, 255, 255)",
      primaryContainer: "rgb(255, 218, 213)",
      onPrimaryContainer: "rgb(65, 0, 1)",
      secondary: "rgb(156, 65, 64)",
      onSecondary: "rgb(255, 255, 255)",
      secondaryContainer: "#F9DEDC",
      onSecondaryContainer: "rgb(65, 0, 5)",
      tertiary: "rgb(112, 92, 46)",
      onTertiary: "rgb(255, 255, 255)",
      tertiaryContainer: "rgb(252, 223, 166)",
      onTertiaryContainer: "rgb(38, 26, 0)",
      error: "rgb(186, 26, 26)",
      onError: "rgb(255, 255, 255)",
      errorContainer: "rgb(255, 218, 214)",
      onErrorContainer: "rgb(65, 0, 2)",
      background: "rgb(255, 251, 255)",
      onBackground: "rgb(32, 26, 25)",
      surface: "rgb(255, 251, 255)",
      onSurface: "rgb(32, 26, 25)",
      surfaceVariant: "rgb(245, 221, 218)",
      onSurfaceVariant: "rgb(83, 67, 65)",
      outline: "rgb(133, 115, 112)",
      outlineVariant: "rgb(216, 194, 190)",
      shadow: "rgb(0, 0, 0)",
      scrim: "rgb(0, 0, 0)",
      inverseSurface: "rgb(54, 47, 46)",
      inverseOnSurface: "rgb(251, 238, 236)",
      inversePrimary: "rgb(255, 180, 170)",
      elevation: {
        level0: "transparent",
        level1: "rgb(251, 240, 244)",
        level2: "rgb(249, 234, 237)",
        level3: "rgb(247, 228, 230)",
        level4: "rgb(246, 226, 228)",
        level5: "rgb(245, 221, 224)"
      },
      surfaceDisabled: "rgba(32, 26, 25, 0.12)",
      onSurfaceDisabled: "rgba(32, 26, 25, 0.38)",
      backdrop: "rgba(59, 45, 43, 0.4)"
    }
  };

  const [batteryPercentage, setBatteryPercentage] = useState(100);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('cadastrados'); // Valor inicial para o SegmentedButtons
  const [devices, setDevices] = useState([]);
  const [isConnected, setIsConnected] = useState(false); // Estado para monitorar a conexão
  const [connectedDevice, setConnectedDevice] = useState(null); // Dispositivo conectado
  const opacity = useRef(new Animated.Value(1)).current; // Valor de opacidade inicial para a animação

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const reduceBattery = (amount) => {
    setBatteryPercentage((prev) => Math.max(prev - amount, 0)); // Reduce battery but not below 0
  };

  const getBatteryIconAndColor = () => {
    let icon = "";
    let color = "";

    if (batteryPercentage > 90) {
      icon = "battery";
      color = "#36ab00"; // Verde
    } else if (batteryPercentage > 80) {
      icon = "battery-80";
      color = "#36ab00"; // Verde
    } else if (batteryPercentage > 60) {
      icon = "battery-60";
      color = "#ADFF2F"; // Amarelo-Verde
    } else if (batteryPercentage > 40) {
      icon = "battery-40";
      color = "#FFD700"; // Amarelo
    } else if (batteryPercentage > 20) {
      icon = "battery-20";
      color = "#FFA500"; // Laranja
    } else {
      icon = "battery-alert";
      color = "#FF0000"; // Vermelho Crítico
    }

    return { icon, color };
  };

  const { icon, color } = getBatteryIconAndColor();

  const animateView = () => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    animateView();
  }, [value]);

  const fetchDevices = async () => {
    try {
      const querySnapshot = await firestore.collection('DispositivosCanis').get();
      setDevices(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Erro ao buscar dispositivos:", error);
      Alert.alert("Erro", "Não foi possível carregar os dispositivos.");
    }
  };

  const handleDeviceSelect = async (device) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    try {
      await firestore.collection('DispositivosCanis').doc(device.id).update({
        userID: user.uid,
      });

      setConnectedDevice(device); // Define o dispositivo conectado
      setIsConnected(true); // Marca como conectado
      Alert.alert("Sucesso", "Dispositivo conectado com sucesso!");
      hideModal();
    } catch (error) {
      console.error("Erro ao conectar dispositivo:", error);
      Alert.alert("Erro", "Não foi possível conectar o dispositivo.");
    }
  };

  return (
    <Provider theme={customTheme}>
      <ImageBackground
        style={[styles.capa, { borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }]}
        source={require('../assets/capa3.png')}
      >
        <View style={styles.imgContainer}>
          <Image style={styles.dog} source={require('../assets/dog.png')} />
        </View>
      </ImageBackground>
      <ScrollView>
        <View style={styles.container}>
          <Portal>
            <Modal visible={visible} transparent animationType="fade" onShow={fetchDevices}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Dialog.Icon icon="alert" />
                  <Dialog.Title style={{ textAlign: 'center' }}>Selecione seu Dispositivo</Dialog.Title>
                  <Dialog.Content>
                    <SegmentedButtons
                      value={value}
                      onValueChange={(newValue) => setValue(newValue)}
                      buttons={[
                        { value: 'cadastrados', label: 'Cadastrados' },
                        { value: 'naoCadastrados', label: 'Desconhecidos' },
                      ]}
                    />
                    <Animated.View style={{ opacity }}>
                      {value === 'cadastrados' ? (
                        <FlatList
                          data={devices.filter(device => device.userID === auth.currentUser?.uid)}
                          keyExtractor={(item) => item.id}
                          renderItem={({ item }) => (
                            <View style={styles.modalArea}>
                              <List.Item
                                title={`Dispositivo Canis`}
                                description={`Battery Level: ${item.batteryLevel || 'N/A'}`}
                                left={(props) => <List.Icon {...props} icon="access-point-check" />}
                                onPress={() => handleDeviceSelect(item)}
                              />
                            </View>
                          )}
                        />
                      ) : (
                        <FlatList
                          data={devices.filter(device => !device.userID)}
                          keyExtractor={(item) => item.id}
                          renderItem={({ item }) => (
                            <View style={styles.modalArea}>
                              <List.Item
                                title={`Dispositivo Canis`}
                                description={`Battery Level: ${item.batteryLevel || 'N/A'}`}
                                left={(props) => <List.Icon {...props} icon="access-point-plus" />}
                                onPress={() => handleDeviceSelect(item)}
                              />
                            </View>
                          )}
                        />
                      )}
                    </Animated.View>
                  </Dialog.Content>
                  <Button onPress={hideModal} mode="contained" style={styles.closeButton}>
                    Voltar
                  </Button>
                </View>
              </View>
            </Modal>
          </Portal>

          <View style={styles.row}>
            <View style={styles.column2}>
              <Card mode="outlined" style={[styles.card, { height: 140, backgroundColor: '#FFF8F7', borderRadius: 24 }]}>
                <Card.Title
                  title="Dispositivo"
                  right={(props) => (
                    <IconButton
                      {...props}
                      icon={isConnected ? "access-point" : "access-point-off"} // Ícone muda de acordo com o estado
                      size={24}
                    />
                  )}
                />
                <Card.Content>
                  <Text style={{ fontSize: 25 }}>
                    {isConnected ? "Conectado" : "Não Conectado"} {/* Texto muda dinamicamente */}
                  </Text>
                </Card.Content>
              </Card>
              <Button buttonColor="#BE0C12" mode="contained" onPress={showModal}>
                Parear
              </Button>
            </View>
            <View style={styles.column}>
              <Card mode="outlined" style={[styles.cont, { backgroundColor: '#FFF8F7', width: '100%', borderRadius: 32 }]}>
                <Card.Content style={styles.conteu}>
                  <Text style={styles.fontBa}>{batteryPercentage}%</Text>
                  <Icon source={icon} size={64} color={color} />
                </Card.Content>
              </Card>
            </View>
          </View>

          <Card mode="outlined" style={[styles.card, { width: '100%', backgroundColor: '#FFF8F7', borderRadius: 24 }]}>
            <Card.Title title="Aviso" />
            <Card.Content>
              <Text style={{ fontSize: 20 }}>
                Se houver outro canino, adicione-o na página 'Conta' do app.
              </Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  capa: {
    width: '100%',
    height: 390,
    overflow: 'hidden',
  },
  dog: {
    position: 'absolute',
    left: 100,
    bottom: -20,
    width: 500,
    height: 300,
  },
  imgContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  container: {
    flex: 1,
    gap: 24,
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  row: {
    flexDirection: 'row-reverse',
    display: 'flex',
    alignContent: 'space-around',
    height: 200,
    width: '100%',
    gap: 16,
  },
  cont: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 'auto',
  },
  fontBa: {
    fontSize: 24,
    fontWeight: "500",
  },
  conteu: {
    width: '100%',
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  column: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
    height: '100%',
  },
  column2: {
    flex: 2,
    width: '50%',
    height: '100%',
    justifyContent: 'space-between',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFF8F7',
    borderRadius: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escurecido
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
  },
  modalArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF8F7',
    padding: 16,
    marginTop: 16,
    borderRadius: 16,
  },
  closeButton: {
    backgroundColor: '#BE0C12',
    marginTop: 20,
  },
});

export default HomeRoute;
