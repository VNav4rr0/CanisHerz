import React, { useState, useEffect } from 'react';
import { BottomNavigation, Provider, DefaultTheme } from 'react-native-paper';
import { BackHandler } from 'react-native';
import HomeRoute from './homeRoute';
import MedidorRoute from './medidorRoute';
import PerfilRoute from './perfilRoute';

export default function Home() {

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

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
    },
    {
      key: 'medidor',
      title: 'Medidor',
      focusedIcon: 'heart',
      unfocusedIcon: 'heart-outline',
    },
    {
      key: 'perfil',
      title: 'Perfil',
      focusedIcon: 'dog',
      unfocusedIcon: 'bone',
    },
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

  // Definindo um tema customizado
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#232323', // Cor para a barra inferior quando a aba está ativa
      background: '#fff',
      surface: '#fff',
      text: '#232323',
      disabled: '#757575',
    },
  };

  return (
    <Provider theme={customTheme}>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        activeColor={theme.colors.primary} // Usando a cor primária para o item ativo
        inactiveColor={theme.colors.disabled} // Cor para o item inativo
        barStyle={{
          backgroundColor: theme.colors.background,
          borderTopWidth: 1,
          borderTopColor: '#ccc',
        }}
      />
    </Provider>
  );
}
