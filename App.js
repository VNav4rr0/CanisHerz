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
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync(); // Esconde a splash screen quando o estado de carregamento termina
    }
  }, [isLoading]);

  if (isLoading) {
    // Retorna null enquanto a autenticação está carregando (Splash Screen visível)
    return null;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'ios',
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 100,
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 100,
                },
              },
            },
            cardStyleInterpolator: ({ current }) => ({
              cardStyle: {
                opacity: current.progress,
              },
            }),
          }}
        >
          {/* Rotas principais */}
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
