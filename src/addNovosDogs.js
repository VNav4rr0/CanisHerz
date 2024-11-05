import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, ImageBackground, ToastAndroid } from 'react-native';
import { TextInput, Button, Provider, IconButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from './firebaseConfig'; // Certifique-se de que está importando corretamente

export default function AddNovosDogs() {
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState('');
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);

  // Obtém o ID do usuário autenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
      } else {
        // Se não estiver autenticado, redirecionar para a tela de login ou tratamento
        navigation.navigate('Login'); // Mude para o nome da sua tela de login
      }
    });

    return unsubscribe; // Limpa o listener ao desmontar o componente
  }, [navigation]);

  const handleFinalizar = async () => {
    // Verifique se os campos estão preenchidos
    if (!nickname.trim() || !birthDate.trim() || !weight.trim() || !size) {
      ToastAndroid.show("Por favor, preencha todos os campos.", ToastAndroid.SHORT);
      return;
    }
  
    try {
      // Armazenando dados do cachorro no Firestore
      await firestore.collection('Tutores').doc(userId).collection('Cachorros').add({
        Apelido: nickname,
        Nascimento: birthDate,
        Peso: weight,
        Porte: size,
      });
  
      ToastAndroid.show("Cachorro cadastrado com sucesso!", ToastAndroid.SHORT);
      navigation.navigate('Home'); // Navega para a tela Home
    } catch (error) {
      console.error("Erro ao cadastrar cachorro:", error);
      ToastAndroid.show("Erro ao cadastrar cachorro. Tente novamente.", ToastAndroid.SHORT);
    }
  };
  

  return (
    <Provider>
      <ImageBackground source={require('../assets/patas.png')} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.titleCont}>
            <IconButton
              icon="arrow-left"
              onPress={() => navigation.goBack()}
              size={24}
              iconColor="#fff"
              style={styles.backButton}
            />
          </View>
          <View>
            <Text style={styles.title}>Cadastre novos cachorros!</Text>
            <TextInput
              label="Apelido"
              value={nickname}
              onChangeText={setNickname}
              style={styles.input}
              theme={{ colors: { primary: '#900C0A' } }}

            />
            <View style={styles.row}>
              <TextInput
                label="Data de Nascimento"
                value={birthDate}
                onChangeText={setBirthDate}
                style={[styles.input, styles.halfInput]}
                theme={{ colors: { primary: '#900C0A' } }}

              />
              <TextInput
                label="Peso"
                value={weight}
                onChangeText={setWeight}
                style={[styles.input, styles.halfInput, styles.peso]}
                theme={{ colors: { primary: '#900C0A' } }}

              />
            </View>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Porte</Text>
              <Picker
                selectedValue={size}
                onValueChange={(itemValue) => setSize(itemValue)}
                style={styles.picker}
                mode="dialog"
              >
                <Picker.Item label="Selecione o porte" value="" />
                <Picker.Item label="Pequeno" value="Pequeno" />
                <Picker.Item label="Médio" value="Médio" />
                <Picker.Item label="Grande" value="Grande" />
              </Picker>
            </View>
          </View>
          <View>
            <Button mode="contained" style={styles.button} labelStyle={{ color: '#fff' }} onPress={handleFinalizar}>
              Finalizar
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
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  peso: {
    width: '30%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '65%',
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    marginBottom: 16,
    borderRadius: 4,
    borderBottomWidth: 1,
    borderColor: '#CCC',
    height: 70,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  picker: {
    width: '100%',
    height: 60,
  },
  pickerLabel: {
    marginLeft: 16,
    marginTop: 16,
    top: -5,
    position: 'absolute',
    fontSize: 12,
    color: '#49454F',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#BE0C12',
    height: 40,
    paddingVertical: 0,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
});
