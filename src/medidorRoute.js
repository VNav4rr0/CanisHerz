import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  Easing
} from "react-native";
import { Button, Modal, Portal, Provider, List } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { firestore, auth } from "./firebaseConfig";
import { collection, query, where, onSnapshot, addDoc } from "firebase/firestore";
import dayjs from "dayjs";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MedidorRoute = () => {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedDog, setSelectedDog] = useState(null);
  const [beatAvg, setBeatAvg] = useState(null); // Stores the beatAvg value
  const [userId, setUserId] = useState(null);
  const [beatValues, setBeatValues] = useState([]);
  const [dogs, setDogs] = useState([]);
  const heartScale = useState(new Animated.Value(1))[0]; // Animation state for heart pulsing

  const normalRange = { min: 60, max: 120 }; // Define the normal BPM range

  const getUserId = () => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid); // Updates userId with the logged-in user's id
    }
  };

  const fetchCardioData = () => {
    if (!userId) return; // If userId is not available, don't fetch data

    const devicesRef = collection(firestore, "DispositivosCanis");
    const q = query(devicesRef, where("userID", "==", userId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setBeatAvg(null); // Clear the value if no data
        } else {
          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            setBeatAvg(data.beatAvg || null); // Set the beatAvg value
          });
        }
      },
      (error) => {
        console.error("Erro ao buscar os dados:", error);
      }
    );

    return unsubscribe;
  };

  const fetchDogs = () => {
    if (!userId) return; // If userId is not available, don't fetch dogs

    const userRef = firestore.collection('Tutores').doc(userId);
    const dogsRef = userRef.collection('Cachorros');

    const unsubscribe = dogsRef.onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        const fetchedDogs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            nome: data.Apelido,
            nascimento: data.Nascimento,
            peso: data.Peso,
            porte: data.Porte
          };
        });
        setDogs(fetchedDogs);
      } else {
        setDogs([]);
      }
    }, (error) => {
      console.error("Erro ao buscar cães:", error);
    });

    return unsubscribe;
  };

  const saveHeartRateData = async () => {
    // Log para ver o estado de beatValues
    console.log("Tentando salvar dados... BeatValues:", beatValues);
  
    // Verifique se há um cão selecionado
    if (!selectedDog) {
      console.log("Nenhum cão selecionado");
      return;
    }
  
    // Verifique se o array beatValues está vazio
    if (beatValues.length === 0) {
      console.log("Batimentos ainda não coletados.");
      return; // Não prosseguir com a operação de salvar se os batimentos estiverem vazios
    }
  
    // Se beatValues não estiver vazio, continue com a lógica de salvar
    const highest = Math.max(...beatValues);
    const lowest = Math.min(...beatValues);
    const average = (beatValues.reduce((a, b) => a + b, 0) / beatValues.length).toFixed(2);
    const timestamp = new Date();
  
    try {
      // Salvar os dados no Firestore
      const dogRef = firestore.collection("Tutores").doc(userId).collection("Cachorros").doc(selectedDog.id);
      const statsRef = dogRef.collection("DadosDiarios");
  
      await addDoc(statsRef, {
        AltoPico: highest,
        BaixoPico: lowest,
        Media: Number(average),
        Data: timestamp,
      });
  
      console.log("Dados salvos com sucesso:", { highest, lowest, average, timestamp });
      setBeatValues([]);  // Reset após salvar os dados
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
    }
  };
  
  

  // Schedule saving data twice a day
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Tentando salvar dados...");
      // Verifique se o estado de 'selectedDog' é válido antes de salvar
      if (selectedDog) {
        saveHeartRateData();
      } else {
        console.log("Aguarde a seleção de um cão.");
      }
    }, 60 * 1000); // 1 minuto

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, [selectedDog]); // Adiciona 'selectedDog' como dependência

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const unsubscribeCardio = fetchCardioData();
      const unsubscribeDogs = fetchDogs();
      return () => {
        unsubscribeCardio();
        unsubscribeDogs();
      };
    }
  }, [userId]);  // A dependência apenas em userId

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const selectDog = (dog) => {
    console.log("Selecionando cão:", dog);
    setSelectedDog(dog);
    console.log("Estado de selectedDog após atualização:", dog); // Verifica se o estado está correto
    setBeatValues([]); // Limpa os batimentos ao selecionar um novo cão
  };

  // Function to determine the heart rate status
  const getHeartRateStatus = () => {
    if (beatAvg === null) return "N/A";
    if (beatAvg < normalRange.min) return "Baixo";
    if (beatAvg > normalRange.max) return "Alto";
    return "Normal";
  };

  const shouldShowInstructionsButton = beatAvg !== null && (beatAvg < normalRange.min || beatAvg > normalRange.max);

  // Pulsing animation for the heart icon
  useEffect(() => {
    if (beatAvg !== null) {
      // Inicia a animação apenas quando `beatAvg` muda
      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
        Animated.timing(heartScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
      ]).start();
    }
  }, [beatAvg]);

  return (
    <Provider contentContainerStyle={styles.scrollViewContainer}>
      <ScrollView>
        <ImageBackground
          source={require('../assets/header.png')}
          style={styles.headerBackground}
          imageStyle={styles.headerImage}
        >
          <View style={styles.overlay}>
            <Text style={styles.petName}>{selectedDog ? selectedDog.nome : "Selecione um cão"}</Text>
          </View>
        </ImageBackground>

        <View style={styles.infoContainer}>
          <Text style={styles.petInfo}>Informações do Cão</Text>
          <Text style={styles.petDetails}>Nome: {selectedDog ? selectedDog.nome : "NA"}</Text>
          <Text style={styles.petDetails}>Nascimento: {selectedDog ? selectedDog.nascimento : "NA"}</Text>
          <Text style={styles.petDetails}>Peso: {selectedDog ? selectedDog.peso : "NA"}</Text>
          <Text style={styles.petDetails}>Porte: {selectedDog ? selectedDog.porte : "NA"}</Text>
        </View>

        <List.Section>
          <List.Accordion
            title="Cães cadastrados"
            expanded={expanded}
            onPress={handlePress}
            style={styles.customAccordion}
            titleStyle={styles.accordionTitle}
            description={selectedDog ? `Cão selecionado: ${selectedDog.nome}` : "Selecione um cão para medir os batimentos"}
          >
            <View style={styles.accordionItemContainer}>
              <ScrollView style={styles.accordionItemsScroll}>
                {dogs.map((dog) => (
                  <List.Item
                    key={dog.id}
                    title={dog.nome}
                    style={[styles.accordionItem, selectedDog?.id === dog.id && styles.selectedDog]}
                    onPress={() => selectDog(dog)}
                  />
                ))}
              </ScrollView>
            </View>
          </List.Accordion>
        </List.Section>

        <View style={styles.container}>
          <View style={styles.bpmContainer}>
            <View style={styles.heartContainer}>
              <Text style={styles.bpmLabel}>BPM</Text>
              <Text style={styles.bpmText}>
                {beatAvg !== null ? beatAvg : "N/A"}
              </Text>
              <Animated.View style={[{ transform: [{ scale: heartScale }] }]}>
                <MaterialCommunityIcons
                  name="heart"
                  size={32}
                  color="#E81616"
                  style={styles.heartIcon}
                />
              </Animated.View>
            </View>
            <Text style={styles.resultado}>
              {getHeartRateStatus()}
            </Text>
          </View>

          {shouldShowInstructionsButton && (
            <Button
              icon="information"
              mode="contained"
              onPress={showModal}
              style={styles.button}
              labelStyle={styles.label}
            >
              Instruções
            </Button>
          )}
        </View>

        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>Instruções</Text>
            <Text style={styles.modalContent}>
              1. Mantenha o cachorro calmo: Evite estresse e mantenha-o em um ambiente tranquilo.
              {'\n\n'}
              2. Entre em contato com o veterinário: Leve o cão à clínica o mais rápido possível.
              {'\n\n'}
              3. Monitore os sintomas: Colapso, dificuldade para respirar e batimentos irregulares são sinais graves.
              {'\n\n'}
              4. Evite RCP sem orientação: Só realize RCP com instrução veterinária, pois técnicas erradas podem prejudicar o cão.
            </Text>
            <View style={styles.modalButtonContainer}>
              <Button onPress={hideModal} mode="contained" style={styles.closeButton}>
                Voltar
              </Button>
            </View>
          </Modal>
        </Portal>
      </ScrollView>
    </Provider>
  );
};
const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  headerBackground: {
    width: '100%',
    height: 250,
    overflow: 'hidden',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  bpmText: {
    fontSize: 10,
  },
  headerImage: {
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(139, 0, 0, 0.6)',
    padding: 20,
  },
  petName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    padding: 20,
  },
  petInfo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  petDetails: {
    fontSize: 16,
    color: '#555',
  },

  selectedDog: {
    backgroundColor: '#F0F0F0', // ou qualquer cor para destacar
  },

  customAccordion: {
    backgroundColor: '#FFF8F7',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#808080',

  },
  accordionTitle: {
    fontSize: 18,
    color: '#232323',
    fontWeight: 'bold',
  },
  accordionItemsScroll: {
    maxHeight: 150,  // Limita a altura do scroll
  },
  accordionItemContainer: {
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#808080',
    width: 'auto',
    marginHorizontal: 20,
  },
  accordionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
    backgroundColor: '#FFF8F7',

  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bpmContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    backgroundColor: '#FFF8F7',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#808080',
  },
  resultado: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 16,
  },
  heartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bpmText: {
    fontSize: 64,
    color: '#1C1B1F',
  },
  iconC: {
    display: 'flex',
    justifyContent: 'start',
    height: 50,
  },
  heartIcon: {
   marginTop: 16,
  },
  bpmLabel: {
    fontSize: 17, // Tamanho do texto "BPM"
    color: '#1C1B1F',
    position: 'absolute',
    top: -5, // Ajuste a posição vertical conforme necessário
    left: 8, // Ajuste a posição horizontal conforme necessário
  },
  button: {
    backgroundColor: '#BE0C12',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
  },
  modalContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    backgroundColor: '#BE0C12',
    width: 'auto',
  },
});

export default MedidorRoute;
