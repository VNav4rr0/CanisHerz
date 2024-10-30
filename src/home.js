// Home.js
import React, { useState } from 'react';
import { BottomNavigation, Provider } from 'react-native-paper';
import { auth } from './firebaseConfig'; // Ajuste o caminho conforme necessário
import HomeRoute from './homeRoute'; // Corrija o caminho se necessário
import MedidorRoute from './medidorRoute'; // Corrija o caminho se necessário
import PerfilRoute from './perfilRoute'; // Corrija o caminho se necessário

export default function Home() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
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
    <Provider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={styles.navBar}
        activeColor="#232323" // Cor dos ícones selecionados
        inactiveColor="#757575" // Cor dos ícones não selecionados
      />
    </Provider>
  );
}

const styles = {
  navBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
};
