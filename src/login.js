import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, ImageBackground } from 'react-native';
import { TextInput, Button, Provider, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth } from './firebaseConfig'; // Ajuste o caminho conforme necessário
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

// Importar as rotas
import HomeRoute from './homeRoute';
import MedidorRoute from './medidorRoute';
import PerfilRoute from './perfilRoute';
import { BottomNavigation } from 'react-native-paper';

export default function Home() {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'medidor', title: 'Medidor', focusedIcon: 'heart', unfocusedIcon: 'heart-outline' },
    { key: 'perfil', title: 'Perfil', focusedIcon: 'dog', unfocusedIcon: 'bone' },
  ]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigation.navigate('Login'); // Redireciona para a tela de login se o usuário não estiver autenticado
      }
    });
    return unsubscribe; // Limpeza ao desmontar o componente
  }, [navigation]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    medidor: MedidorRoute,
    perfil: PerfilRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={styles.navBar}
      activeColor="#232323"
      inactiveColor="#757575"
    />
  );
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCadastrar = () => {
    navigation.navigate('CadastroTutor');
  };

  const handleSubmit = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home'); // Navega para a tela Home após login bem-sucedido
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      // Exibir uma mensagem de erro para o usuário, se necessário
    }
  };

  return (
    <Provider>
      <ImageBackground source={require('../assets/back_login.png')} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.titleCont}>
            <IconButton
              icon="arrow-left"
              onPress={handleGoBack}
              size={24}
              iconColor="#fff"
              style={styles.backButton}
            />
          </View>
          <View style={styles.form}>
            <Text style={styles.title}>Entrar</Text>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              theme={{ colors: { primary: '#900C0A' } }}
            />
            <TextInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
              theme={{ colors: { primary: '#900C0A' } }}
            />
            <Button mode="text" style={styles.esqueceu} labelStyle={{ color: '#fff', fontSize: 16 }}>
              Esqueceu a Senha?
            </Button>
          </View>
          <View>
            <Button mode="outlined" labelStyle={{ color: '#fff', fontSize: 16 }} style={{ borderColor: '#fff' }} onPress={handleCadastrar}>
              Cadastrar-se
            </Button>
            <Button mode="contained" style={styles.button} labelStyle={{ color: '#fff', fontSize: 16 }} onPress={handleSubmit}>
              Entrar
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
  },
  form: {
    paddingTop: 200,
    justifySelf: 'flex-end',
  },
  titleCont: {
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: -10,
    top: 0,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 64,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 50,
  },
  input: {
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  esqueceu: {
    alignSelf: 'flex-start',
  },
  cadastrar: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#B3261E',
    height: 40,
    paddingVertical: 0,
    paddingHorizontal: 10,
    alignSelf: 'center',
    width: '100%',
  },
});
