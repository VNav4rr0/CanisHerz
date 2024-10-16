import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button, Provider, IconButton, Card, Icon } from 'react-native-paper';

const HomeRoute = () => {
  const [batteryPercentage, setBatteryPercentage] = useState(100); // Initial battery percentage

  // Function to deduct battery percentage
  const reduceBattery = (amount) => {
    setBatteryPercentage((prev) => Math.max(prev - amount, 0)); // Reduce battery but not below 0
  };

  // Function to get the icon and color based on battery percentage
  const getBatteryIconAndColor = () => {
    let icon = "";
    let color = "";

    if (batteryPercentage > 100) {
      icon = "battery";
      color = "#009951"; // Verde
    } else if (batteryPercentage > 90) {
      icon = "battery";
      color = "#009951"; // Verde
    } else if (batteryPercentage > 80) {
      icon = "battery-80";
      color = "#009951"; // Verde
    } else if (batteryPercentage > 70) {
      icon = "battery-70";
      color = "#009951"; // Amarelo-Verde
    } else if (batteryPercentage > 60) {
      icon = "battery-60";
      color = "#009951"; // Amarelo-Verde
    } else if (batteryPercentage > 50) {
      icon = "battery-50";
      color = "#009951"; // Amarelo
    } else if (batteryPercentage > 40) {
      icon = "battery-40";
      color = "#009951"; // Amarelo
    } else if (batteryPercentage > 30) {
      icon = "battery-30";
      color = "#009951"; // Laranja
    } else if (batteryPercentage > 20) {
      icon = "battery-20";
      color = "#009951"; // Laranja
    } else if (batteryPercentage > 10) {
      icon = "battery-10";
      color = "#E8B931"; // Vermelho
    } else {
      icon = "battery-alert";
      color = "#E8B931"; // Vermelho Crítico
    }

    return { icon, color };
  };

  const { icon, color } = getBatteryIconAndColor();

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
                <Icon source={icon} size={64} color={color} />
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
    width: '20%',
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
