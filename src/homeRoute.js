import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button, Provider, IconButton, Card, Icon } from 'react-native-paper';

const HomeRoute = () => {
  const [batteryPercentage, setBatteryPercentage] = useState(90); // Initial battery percentage

  // Function to deduct battery percentage
  const reduceBattery = (amount) => {
    setBatteryPercentage((prev) => Math.max(prev - amount, 0)); // Reduce battery but not below 0
  };

  // Function to get the icon based on battery percentage
  const getBatteryIcon = () => {
    if (batteryPercentage > 100) return "battery"; // High battery
    if (batteryPercentage > 90) return "battery-90"; // High battery
    if (batteryPercentage > 80) return "battery-80"; // High battery
    if (batteryPercentage > 70) return "battery-70"; // High battery
    if (batteryPercentage > 60) return "battery-60"; // High battery
    if (batteryPercentage > 50) return "battery-50"; // High battery
    if (batteryPercentage > 40) return "battery-40"; // High battery
    if (batteryPercentage > 30) return "battery-30"; 
    if (batteryPercentage > 20) return "battery-20"; 
    if (batteryPercentage > 10) return "battery-10"; // Low battery
    return "battery-alert"; // Critical battery
  };

  return (
    <Provider>
      <ImageBackground 
        style={[styles.capa, { borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }]} 
        source={require('../assets/capa3.png')}
      >
        <View style={styles.imgContainer}>
          <Image 
            style={styles.dog} 
            source={require('../assets/dog.png')} 
          />
        </View>
      </ImageBackground>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.column2}>
            <Card mode='outlined' style={[styles.card, { height: 140, backgroundColor: '#FFF8F7', borderRadius: 24 }]}>
              <Card.Title
                title="Dispositivo"
                right={(props) => <IconButton {...props} icon="access-point-off" size={24} />}
              />
              <Card.Content>
                <Text style={{ fontSize: 25 }}>Não Conectado</Text>
              </Card.Content>
            </Card>
            <Button buttonColor="#BE0C12" mode="contained">Parear</Button>
          </View>
          <View style={styles.column}>
            <Card mode='outlined' style={[styles.cont, { backgroundColor: '#FFF8F7', width: '100%', borderRadius: 32 }]}>
              <Card.Content style={styles.conteu}>
                <Text style={styles.fontBa}>{batteryPercentage}%</Text>
                <Icon source={getBatteryIcon()} size={64} />
              </Card.Content>
            </Card>
          </View>
        </View>
        <Card mode='outlined' style={[styles.card, { width: "100%", backgroundColor: '#FFF8F7', borderRadius: 24 }]}>
          <Card.Title title="Aviso" />
          <Card.Content>
            <Text style={{ fontSize: 20 }}>Se houver outro canino, adicione-o na página 'Conta' do app.</Text>
          </Card.Content>
        </Card>
      </View>
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
    width: '50%',
    height: '100%',
  },
  column2: {
    flex: 2,
    width: '50%',
    height: '100%',
    justifyContent: 'space-between',
  },
});

export default HomeRoute;
