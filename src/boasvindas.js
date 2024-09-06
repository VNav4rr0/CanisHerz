import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, ImageBackground } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Provider as PaperProvider, Button as PaperButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';

// Prevent auto-hide of splash screen outside the component
SplashScreen.preventAutoHideAsync();

export default function Boasvindas() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const navigation = useNavigation();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const handlePressFormulario = () => {
    navigation.navigate('Formulario');
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
              Cadastrar
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
    fontFamily: 'Poppins_400Regular',
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
    fontFamily: 'Poppins_700Bold',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#FFF',
  },
});
