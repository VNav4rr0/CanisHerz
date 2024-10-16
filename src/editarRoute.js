import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, ImageBackground, Animated, TouchableWithoutFeedback } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { TextInput, Button, Provider, IconButton, Portal, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

// Prevent auto-hide of splash screen
SplashScreen.preventAutoHideAsync();

export default function EditarRoute() {
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState('');
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };



  return (
    <Provider>
      <ImageBackground source={require('../assets/patas.png')} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.titleCont}>
            <IconButton
              icon="arrow-left"
              onPress={handleGoBack}
              size={24}
              iconColor="#fff"
              style={styles.backButton}
            />
            <Text style={styles.title}>
              Edite Suas Informações
            </Text>
          </View>
          <View>
              <Text style={styles.dog}>
                  Cachorro
              </Text>
            <TextInput
              label="Apelido"
              value={nickname}
              onChangeText={setNickname}
              style={styles.input}
            />
            <View style={styles.row}>
              <TextInput
                label="Data de Nascimento"
                value={birthDate}
                onChangeText={text => setBirthDate(text)}
                style={[styles.input, styles.halfInput]}
              />
              <TextInput
                label="Peso"
                value={weight}
                onChangeText={text => setWeight(text)}
                style={[styles.input, styles.halfInput, styles.peso]}
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
                <Picker.Item label="Pequeno" value="Pequeno" />
                <Picker.Item label="Médio" value="Médio" />
                <Picker.Item label="Grande" value="Grande" />
              </Picker>
            </View>
          </View>

          <Text style={styles.tutor}>
                  Tutor
              </Text>

            <TextInput
              label="Nome Completo"
              style={styles.input}
            />
            <TextInput
              label="Email"
              style={styles.input}
            />
            <TextInput
              label="Senha"
              style={styles.input}
            />
            <View style={styles.row}> 
            </View>
          <View>
            <Button mode="contained" style={styles.button} labelStyle={{ color: '#fff' }} >Atualizar</Button>
          </View>

        </ScrollView>
      </ImageBackground>
    </Provider>
  );
}

const styles = StyleSheet.create({

tutor: {
    fontSize: 26,
    color: '#FFF',
    marginBottom: 14,
    marginVertical: 45,
},
  dog: {
  fontSize: 26,
  color: '#FFF',
  marginBottom: 14,
  marginVertical: 45,
  },  
  Provider: {
    fontFamily: 'Poppins_400Regular',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleCont:{
    position:'relative',
  },
  backButton:{
    position:'absolute',
    left:-10,
    top:0,
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
    marginTop:50,
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
  link: {
    color: '#FFF',
    textDecorationLine: 'underline',
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#BE0C12',
    height: 40, 
    paddingVertical: 0, 
    paddingHorizontal: 10, 
    alignSelf: 'center', 
},
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
