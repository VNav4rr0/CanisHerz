import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';

// Importar as rotas
import HomeRoute from './homeRoute'; // Corrija o caminho se necessário
import MedidorRoute from './medidorRoute'; // Corrija o caminho se necessário
import PerfilRoute from './perfilRoute'; // Corrija o caminho se necessário

export default function Home() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'medidor', title: 'Medidor', focusedIcon: 'heart', unfocusedIcon: 'heart-outline' },
    { key: 'perfil', title: 'Perfil', focusedIcon: 'dog', unfocusedIcon: 'bone' },
  ]);

  // Renderiza as cenas conforme a aba selecionada
  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    medidor: MedidorRoute,
    perfil: PerfilRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={styles.navBar}
      activeColor="#232323" // Cor dos ícones selecionados
      inactiveColor="#757575" // Cor dos ícones não selecionados
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1, // Borda superior
    borderTopColor: '#ccc', // Cor da borda
  },
});
