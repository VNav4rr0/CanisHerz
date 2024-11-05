import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, ImageBackground, Animated, TouchableWithoutFeedback } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { TextInput, Button, Provider, Portal, useTheme, Banner } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

// Prevent auto-hide of splash screen
SplashScreen.preventAutoHideAsync();

export default function Formulario() {
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState('');
  const [visible, setVisible] = useState(true); // Set to true to show the Banner initially
  const animation = useState(new Animated.Value(0))[0];
  const theme = useTheme();
  const navigation = useNavigation();

  const handleSubmit = () => {
    navigation.navigate('CarregamentoNovo', {
      nomeCachorro: nickname,
    });
  };

  const showModal = () => {
    setVisible(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  return (
    <Provider>
      {/* Banner Component */}
      <Banner
        visible={visible}
        actions={[
          {
            label: 'Fix it',
            onPress: () => setVisible(false),
          },
          {
            label: 'Learn more',
            onPress: () => setVisible(false),
          },
        ]}
        icon={({ size }) => (
          <Image
            source={{
              uri: 'https://avatars3.githubusercontent.com/u/17571969?s=400&v=4',
            }}
            style={{
              width: size,
              height: size,
            }}
          />
        )}
      >
        There was a problem processing a transaction on your credit card.
      </Banner>

      <ImageBackground source={require('../assets/patas.png')} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>
            Em seguida, solicitamos que você registre seu cachorro.
          </Text>
          <View>
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
              <TextInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
              theme={{ colors: { primary: '#900C0A' } }}
            />
            </View>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Porte</Text>
              <Picker
                selectedValue={size}
                onValueChange={setSize}
                style={styles.picker}
                mode="dialog"
              >
                <Picker.Item label="Pequeno" value="Pequeno" />
                <Picker.Item label="Médio" value="Médio" />
                <Picker.Item label="Grande" value="Grande" />
              </Picker>
            </View>
            <Button mode="text" labelStyle={{ color: '#fff' }} onPress={showModal}>
              Por que usar essas informações?
            </Button>
          </View>
          <View>
            <Button
              mode="contained"
              style={styles.button}
              labelStyle={{ color: '#1E1E1E' }}
              onPress={handleSubmit}
            >
              Finalizar
            </Button>
          </View>

          {/* Modal Portal */}
          <Portal>
            {visible && (
              <TouchableWithoutFeedback onPress={hideModal}>
                <Animated.View
                  style={[styles.overlay, { backgroundColor: theme.colors.backdrop, opacity: animation }]}
                >
                  <TouchableWithoutFeedback>
                    <Animated.View style={[styles.modalView, { opacity: animation }]}>
                      <Text style={styles.modalTitle}>Proposito</Text>
                      <Text style={styles.modalText}>
                        Essas informações permitem uma abordagem eficaz no cuidado dos cães, garantindo que o
                        monitoramento e as intervenções sejam o mais adequadas possível.
                      </Text>
                      <View style={styles.modalButtonContainer}>
                        <Button mode="contained" onPress={hideModal} style={styles.modalButton}>
                          Voltar
                        </Button>
                      </View>
                    </Animated.View>
                  </TouchableWithoutFeedback>
                </Animated.View>
              </TouchableWithoutFeedback>
            )}
          </Portal>
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
    fontFamily: 'Poppins_700Bold',
  },
  input: {
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
    backgroundColor: '#FFF',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'Poppins_700Bold',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'Poppins_400Regular',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#D64235',
  },
});
