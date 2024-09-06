import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MedidorRoute = () => (
  <View style={styles.container}>
    <Text variant="headlineMedium">Medidor!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MedidorRoute;
