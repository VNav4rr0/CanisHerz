import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, Provider, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth } from './firebaseConfig'; // Ajuste o caminho conforme necessário
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigation = useNavigation();

  // Função de validação de email
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCadastrar = () => {
    navigation.navigate('CadastroTutor');
  };

  const handleForgotPassword = () => {
    navigation.navigate('EsqueceuSenha', { email });
  };

  const handleSubmit = () => {
    // Validação de email e senha
    if (!isValidEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user; // Obtém o usuário autenticado
        setLoading(false);
        setSnackbarMessage('Login realizado com sucesso!');
        setSnackbarVisible(true);

        // Navegação para a Home após login bem-sucedido
        navigation.navigate('Home');

        // Armazenar o userID no AsyncStorage de forma sincronizada
        AsyncStorage.setItem('userID', user.uid)
          .then(() => {
            console.log('userID armazenado com sucesso');
          })
          .catch((error) => {
            console.error('Erro ao armazenar userID:', error);
          });
      })
      .catch((error) => {
        setLoading(false);
        setSnackbarMessage(`Erro ao fazer login: ${error.message}`);
        setSnackbarVisible(true);
      });
  };

  return (
    <Provider>
      <ImageBackground source={require('../assets/back_login.png')} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.titleCont}>
            <Button
              icon="arrow-left"
              onPress={handleGoBack}
              mode="text"
              labelStyle={{ color: '#fff' }}
              style={styles.backButton}
            >
              Voltar
            </Button>
          </View>
          <View style={styles.form}>
            <Text style={styles.title}>Entrar</Text>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
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
            <Button
              mode="text"
              style={styles.esqueceu}
              labelStyle={{ color: '#fff', fontSize: 16 }}
              onPress={handleForgotPassword}
            >
              Esqueceu a Senha?
            </Button>
          </View>
          <View>
            {loading ? (
              <ActivityIndicator size="large" color="#B3261E" />
            ) : (
              <>
                <Button
                  mode="contained"
                  style={styles.button}
                  labelStyle={{ color: '#fff', fontSize: 16 }}
                  onPress={handleSubmit}
                >
                  Entrar
                </Button>
                <Button
                  mode="outlined"
                  labelStyle={{ color: '#fff', fontSize: 16 }}
                  style={styles.cadastrar}
                  onPress={handleCadastrar}
                >
                  Cadastrar-se
                </Button>
              </>
            )}
          </View>
        </ScrollView>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={styles.snackbar}
        >
          {snackbarMessage}
        </Snackbar>
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
  },
  titleCont: {
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: -10,
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
    marginBottom: 50,
  },
  input: {
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  esqueceu: {
    alignSelf: 'flex-start',
  },
  cadastrar: {
    marginTop: 10,
    borderColor: '#FFF',
  },
  button: {
    marginBottom: 16,
    backgroundColor: '#B3261E',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  snackbar: {
    backgroundColor: '#900C0A',
  },
});
