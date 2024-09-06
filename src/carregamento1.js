import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Image, ImageBackground } from 'react-native';

const Carregamento1 = ({ nickname, onTransitionEnd }) => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 4000,
      useNativeDriver: true,
    }).start(() => {
      if (onTransitionEnd) {
        onTransitionEnd(); // Chama a função de transição quando a animação termina
      }
    });
  }, [opacity, onTransitionEnd]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <ImageBackground style={styles.imageBackground} source={require('../assets/noisy-gradients.png')}>
        <Image source={require('../assets/logo1.png')} style={styles.logo} />
        <Text style={styles.text}>Bem-vindo!</Text>
        <Text style={styles.nome}>{nickname}</Text>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: 20,
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
  },
  nome: {
    fontSize: 24,
    color: '#FFF',
  },
});

export default Carregamento1;
