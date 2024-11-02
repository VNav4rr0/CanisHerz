// Boasvindas.js
import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, ImageBackground } from 'react-native';
import { Provider as PaperProvider, Button as PaperButton } from 'react-native-paper';
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

  const handlePressFormulario = async () => {
    // Marca que o usuário já viu a tela de boas-vindas
    await AsyncStorage.setItem('hasSeenWelcome', 'true');
    navigation.navigate('Login');
  };

  const handlePressSobreNos = () => {
    navigation.navigate('SobreNos');
  };

  return (
    <PaperProvider>
      <ImageBackground source={require('../assets/capa_1.png')} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>
            Sinta o Coração do seu Melhor Amigo Batendo Junto com você!
          </Text>
          <View>
            <PaperButton mode="contained" style={styles.button} labelStyle={{ color: '#1E1E1E' }} onPress={handlePressFormulario}>
              Entrar
            </PaperButton>
            <PaperButton mode="text" labelStyle={{ color: '#fff' }} onPress={handlePressSobreNos}>
              Sobre Nós
            </PaperButton>
          </View>
        </ScrollView>
      </ImageBackground>
    </PaperProvider>
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
    backgroundColor: '#FFF',
  },
});
