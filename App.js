import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebaseConfig';

import Boasvindas from './src/boasvindas';
import SobreNos from './src/sobreNos';
import Formulario from './src/formulario';
import CarregamentoNovo from './src/carregamentoNovo';
import Home from './src/home';
import AddNovosDogs from './src/addNovosDogs';
import EditarRoute from './src/editarRoute';
import Login from './src/login';
import CadastroTutor from './src/cadastroTutor';
import EsqueceuSenha from './src/esqueceusenha';
import SelecionarDispositivo from './src/selecionardispositivo';

const Stack = createNativeStackNavigator();

// Previne que a Splash Screen feche automaticamente antes da inicialização
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup para evitar leaks
  }, []);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch(() => {
        console.log('Erro ao esconder Splash Screen');
      }); // Tratar possíveis erros ao esconder a Splash Screen
    }
  }, [isLoading]);

  if (isLoading) {
    return null; // Splash Screen visível
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {user ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="AddNovosDogs" component={AddNovosDogs} />
              <Stack.Screen name="EditarRoute" component={EditarRoute} />
              <Stack.Screen name="SelecionarDispositivo" component={SelecionarDispositivo} />
            </>
          ) : (
            <>
              <Stack.Screen name="Boasvindas" component={Boasvindas} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="CadastroTutor" component={CadastroTutor} />
              <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenha} />
            </>
          )}
          {/* Rotas comuns */}
          <Stack.Screen name="Formulario" component={Formulario} />
          <Stack.Screen name="SobreNos" component={SobreNos} />
          <Stack.Screen name="CarregamentoNovo" component={CarregamentoNovo} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
