import auth from '@react-native-firebase/auth';
import React, { useState } from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import { TextInput, Button, Provider, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const EsqueceuSenha = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  const handlePasswordReset = async () => {
    if (!email) {
      setMessage("Por favor, insira um e-mail válido.");
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      setMessage("Um e-mail para redefinição de senha foi enviado. Verifique sua caixa de entrada.");
    } catch (error) {
      console.error("Erro ao enviar e-mail de redefinição:", error); // Logando o erro
      switch (error.code) {
        case 'auth/invalid-email':
          setMessage("O formato do e-mail está incorreto. Verifique e tente novamente.");
          break;
        case 'auth/user-not-found':
          setMessage("Nenhum usuário encontrado com este e-mail.");
          break;
        case 'auth/network-request-failed':
          setMessage("Erro de conexão. Verifique sua internet e tente novamente.");
          break;
        default:
          setMessage("Ocorreu um erro. Tente novamente mais tarde.");
      }
    }
  };

  return (
    <Provider>
      <ImageBackground source={require('../assets/back_login.png')} style={styles.container}>
        <View style={styles.content}>
          <IconButton
            icon="arrow-left"
            onPress={() => navigation.goBack()}
            size={24}
            iconColor="#fff"
            style={styles.backButton}
          />
          <Text style={styles.title}>Esqueceu sua senha?</Text>
          <Text style={styles.subtitle}>Digite seu e-mail para redefinir sua senha.</Text>

          <TextInput
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            theme={{ colors: { primary: '#900C0A' } }}
          />

          <Button
            mode="contained"
            style={styles.button}
            labelStyle={{ color: '#fff', fontSize: 16 }}
            onPress={handlePasswordReset}
          >
            Enviar e-mail de redefinição
          </Button>

          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
      </ImageBackground>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#B3261E',
    paddingVertical: 8,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
    color: '#FFF',
    fontSize: 16,
  },
});

export default EsqueceuSenha;
