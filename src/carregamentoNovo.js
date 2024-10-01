import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';

const CarregamentoNovo = ({ route, navigation }) => {
  const { nomeCachorro } = route.params || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2000); // Delay de 2 segundos

    return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/patas.png')} style={styles.container}>
        <Image source={require('../assets/logo1.png')} style={styles.icon} />
        <Text style={styles.bemvindo}>Bem-Vindo</Text>
        <Text style={styles.text}>
          {nomeCachorro ? ` ${nomeCachorro}` : 'Carregando...'}
        </Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
  },
  bemvindo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  icon: {
    width: 61,
    height: 50,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    color: '#fff',
  },
});

export default CarregamentoNovo;
