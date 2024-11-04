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

SplashScreen.preventAutoHideAsync(); // Impede que a splash screen feche automaticamente

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser !== null) {
        SplashScreen.hideAsync();
      }
    });
    return () => unsubscribe();
  }, []);
  
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
          <Stack.Screen name="Boasvindas" component={Boasvindas} />
          <Stack.Screen name="Formulario" component={Formulario} />
          <Stack.Screen name="SobreNos" component={SobreNos} />
          <Stack.Screen name="CarregamentoNovo" component={CarregamentoNovo} />
          <Stack.Screen name="Home" component={user ? Home : Login} />
          <Stack.Screen name="AddNovosDogs" component={AddNovosDogs} />
          <Stack.Screen name="EditarRoute" component={EditarRoute} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="CadastroTutor" component={CadastroTutor} />
          <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenha} />
          <Stack.Screen name="SelecionarDispositivo" component={SelecionarDispositivo} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
