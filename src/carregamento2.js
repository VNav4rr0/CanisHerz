import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Image } from 'react-native';

const Carregamento2 = ({ onTransitionEnd }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      console.log("Carregamento2 finalizado"); // Debug
      setTimeout(() => {
        if (onTransitionEnd) {
          onTransitionEnd(); // Chama a função de transição após o tempo determinado
        }
      }, 2000); // Tempo de exibição de Carregamento2 antes de transição para Home
    });
  }, [opacity, onTransitionEnd]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Image source={require('../assets/logo.png')} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Carregamento2;
