import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, ScrollView, ImageBackground, LayoutAnimation, Platform, UIManager } from "react-native";
import { Button, Modal, Portal, Provider, List, Icon } from 'react-native-paper';
import { firestore, auth } from "./firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MedidorRoute = () => {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedDog, setSelectedDog] = useState(null);
  const [beatAvg, setBeatAvg] = useState(null); // Armazena o valor de beatAvg
  const [userId, setUserId] = useState(null);
  const [dogs, setDogs] = useState([]);

  const getUserId = () => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid); // Atualiza o userId com o id do usuário logado
    }
  };

  const fetchCardioData = () => {
    if (!userId) return; // Verifica se o userId está disponível

    const devicesRef = collection(firestore, "DispositivosCanis");
    const q = query(devicesRef, where("userID", "==", userId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setBeatAvg(null); // Caso não haja dados, limpa o valor de beatAvg
        } else {
          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            setBeatAvg(data.beatAvg || null); // Armazena o valor de beatAvg
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
    if (!userId) return; // Verifica se o userId está disponível
  
    // Referência à coleção de usuários
    const userRef = firestore.collection('Tutores').doc(userId);
  
    // Referência à subcoleção de cães
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
        setDogs(fetchedDogs); // Atualiza o estado com os cães encontrados
      } else {
        setDogs([]); // Caso não haja cães, limpa a lista
      }
    }, (error) => {
      console.error("Erro ao buscar cães:", error);
    });
  
    // Retorna a função de unsubscribe para limpar a escuta quando o componente for desmontado
    return unsubscribe;
  };
  

  useEffect(() => {
    getUserId(); // Chama a função para obter o userId
  
    const unsubscribeCardio = fetchCardioData(); // Chama a função para buscar os dados de batimentos
    const unsubscribeDogs = fetchDogs(); // Inicia a escuta dos cães
  
    return () => {
      if (unsubscribeCardio) unsubscribeCardio(); // Cancela a escuta dos dados de batimentos
      if (unsubscribeDogs) unsubscribeDogs(); // Cancela a escuta dos cães
    };
  }, [userId]); 


  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const selectDog = (dog) => {
    setSelectedDog(dog);
  };

  return (
    <Provider contentContainerStyle={styles.scrollViewContainer}>
      <ScrollView >
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
            <View style={styles.accordionItemContainer} >
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
              <Text style={styles.bpmText}>{beatAvg !== null ? beatAvg : "Nenhum dado disponível"}</Text>
              <View style={styles.iconC}>
                <Icon
                  source="heart"
                  size={24}
                  color="#E81616"
                  style={styles.heartIcon}
                />
              </View>

            </View>
              <Text style={styles.resultado}><Icon source="check" size={16} style={styles.heartIcon} /> Normal </Text>
          </View>

          <Button
            icon="information"
            mode="contained"
            onPress={showModal}
            style={styles.button}
            labelStyle={styles.label}
          >
            Instruções
          </Button>
        </View>

        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>Instruções</Text>
            <Text style={styles.modalContent}>
              1. Mantenha o cão calmo: Evite estresse e mantenha-o em um ambiente tranquilo.
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
    alignItems: 'center',

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
    marginLeft: 10,
    position: 'absolute',
    top: 0,
    left: 0,
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
