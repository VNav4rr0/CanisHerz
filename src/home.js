import React, { useState, useEffect } from 'react';
import { BottomNavigation, Provider } from 'react-native-paper';
import { BackHandler } from 'react-native';
import HomeRoute from './homeRoute';
import MedidorRoute from './medidorRoute';
import PerfilRoute from './perfilRoute';

export default function Home() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'medidor', title: 'Medidor', focusedIcon: 'heart', unfocusedIcon: 'heart-outline' },
    { key: 'perfil', title: 'Perfil', focusedIcon: 'dog', unfocusedIcon: 'bone' },
  ]);

  // Bloqueia o retorno ao montar o componente
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

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
        activeColor="#232323"
        inactiveColor="#757575"
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
