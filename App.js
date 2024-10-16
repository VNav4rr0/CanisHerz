import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import Boasvindas from './src/boasvindas';
import SobreNos from './src/sobreNos';
import Formulario from './src/formulario';
import CarregamentoNovo from './src/carregamentoNovo';
import Home from './src/home';
import AddNovosDogs from './src/addNovosDogs';
import EditarRoute from './src/editarRoute';

const Stack = createNativeStackNavigator();

export default function App() {
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
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="AddNovosDogs" component={AddNovosDogs} />
          <Stack.Screen name="EditarRoute" component={EditarRoute} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
