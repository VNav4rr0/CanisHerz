// Boasvindas.js
import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, ImageBackground } from 'react-native';
import { Provider, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function Boasvindas() {
  const navigation = useNavigation();

  useEffect(() => {
    // Oculta a splash screen quando o componente termina de carregar
    SplashScreen.hideAsync();
  }, []);

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

  const handlePressFormulario = async () => {
    // Marca que o usuário já viu a tela de boas-vindas
    await AsyncStorage.setItem('hasSeenWelcome', 'true');
    navigation.navigate('Login');
  };

  const handlePressSobreNos = () => {
    navigation.navigate('SobreNos');
  };

  return (
    <Provider theme={customTheme}>
      <ImageBackground source={require('../assets/capa_1.png')} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>
            Sinta o Coração do seu Melhor Amigo Batendo Junto com você!
          </Text>
          <View>
            <Button mode="contained" style={styles.button}  onPress={handlePressFormulario}>
              Entrar
            </Button>
            <Button mode="text" labelStyle={{ color: '#fff' }} onPress={handlePressSobreNos}>
              Sobre Nós
            </Button>
          </View>
        </ScrollView>
      </ImageBackground>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollContent: {
    padding: 16,
    paddingHorizontal: 24,
    paddingTop: 48,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
});
