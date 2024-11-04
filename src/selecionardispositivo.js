// DeviceSelection.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db, auth } from './firebaseConfig'; // Certifique-se de que auth está importado
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

export default function SelecionarDispositivo({ navigation }) {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      const querySnapshot = await getDocs(collection(db, 'DispositivosCanis'));
      setDevices(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchDevices();
  }, []);

  const handleDeviceSelect = async (device) => {
    const user = auth.currentUser; // Obtém o usuário autenticado
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    try {
      // Atualiza o documento do dispositivo, anexando o userID
      await updateDoc(doc(db, "DispositivosCanis", device.id), {
        userID: user.uid, // Anexa o userID ao dispositivo
      });

      Alert.alert("Sucesso", "Dispositivo cadastrado com sucesso!");
      navigation.navigate("Home"); // Redireciona para a tela inicial ou outra tela desejada
    } catch (error) {
      console.error("Erro ao cadastrar dispositivo:", error);
      Alert.alert("Erro", "Não foi possível cadastrar o dispositivo.");
    }
  };

  return (
    <LinearGradient colors={['#8B0000', '#8B0000']} style={styles.container}>
      <Text style={styles.title}>Selecione seu Dispositivo</Text>

      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.deviceButton} 
            onPress={() => handleDeviceSelect(item)} // Chama a função ao selecionar o dispositivo
          >
            <Text style={styles.deviceText}>{item.macAddress}</Text>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: 28, color: '#FFF', textAlign: 'center', marginBottom: 20 },
  deviceButton: { padding: 15, borderRadius: 10, backgroundColor: '#FFF', marginBottom: 10, alignItems: 'center' },
  deviceText: { fontSize: 16, color: '#8B0000' },
});