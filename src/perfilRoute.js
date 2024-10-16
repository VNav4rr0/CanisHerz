import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, ScrollView, ImageBackground, LayoutAnimation, Platform, UIManager } from "react-native";
import { Provider, List, Icon, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; // Importação do hook useNavigation

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PerfilRoute = () => { // Nome do componente deve começar com letra maiúscula
  const navigation = useNavigation(); // Inicializando o hook de navegação
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedDog, setSelectedDog] = useState(null);
  const [dogs, setDogs] = useState([]);

  const fetchDogs = async () => {
    const fetchedDogs = ["Pitico", "Thor", "Max"];
    setDogs(fetchedDogs);
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const selectDog = (dog) => {
    setSelectedDog(dog);
  };

  const handlePressAddNovosDogs = () => {
    navigation.navigate('AddNovosDogs');
  };

  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
  
  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <ImageBackground
          source={require('../assets/header.png')}
          style={styles.headerBackground}
          imageStyle={styles.headerImage}
        >
          <View style={styles.overlay}>
            <Appbar.Header style={styles.header}>
              <Appbar.Content />
              <Appbar.Action icon="plus" onPress={handlePressAddNovosDogs} color="#fff" />
              <Appbar.Action style={styles.btn} mode="contained" icon="pencil" onPress={() => {}} color="#fff" />
            </Appbar.Header>

            <Text style={styles.petName}>João Mendes</Text>
          </View>
        </ImageBackground>

        <List.Section>
          <List.Accordion
            title="Cães cadastrados"
            expanded={expanded}
            onPress={handlePress}
            style={styles.customAccordion}
            titleStyle={styles.accordionTitle}
            description={selectedDog ? `Cão selecionado: ${selectedDog}` : "Selecione um cão para medir os batimentos"}
          >
            <View style={styles.accordionItemContainer}>
              <ScrollView style={styles.accordionItemsScroll}>
                {dogs.map((dog) => (
                  <List.Item
                    key={dog}
                    title={dog}
                    style={styles.accordionItem}
                    onPress={() => selectDog(dog)}
                  />
                ))}
              </ScrollView>
            </View>
          </List.Accordion>
        </List.Section>

        <View style={styles.cardioSection}>
          <Text style={styles.cardioTitle}>Dados Cardíacos</Text>
        </View>

        {/* Dados Cardíacos */}
        {Array(4).fill().map((_, index) => ( // Gera 4 seções de dados cardíacos
          <View key={index} style={styles.container}>
            <View style={styles.bpmContainer}>
              <View style={styles.heartContainer}>
                <Text style={styles.bpmLabel}><Icon source="thumb-up" size={17} style={styles.likeIcon} /> Segunda</Text>
                <Text style={styles.bpmText}>100 BPM</Text>
              </View>
              <Text style={styles.resultado}><Icon source="check" size={16} style={styles.heartIcon} /> Normal </Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  cardioSection: {
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  cardioTitle: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#232323',
    marginBottom: 19,
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0)', // Transparente
    marginHorizontal: 300,
    borderBottomWidth: 0, // Remove a linha inferior
    paddingBottom: 0, // Remove o padding inferior
    marginBottom: 89, // Remove o margin inferior
},
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
  btn: {
    backgroundColor: "#E81616",
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
    paddingTop: 1,
  },
  bpmContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    backgroundColor: '#FFF8F7',
    padding: 10,
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
    marginTop: 16,
  },
  bpmText: {
    paddingHorizontal: 10,
    paddingVertical: 19,
    fontSize: 24,
    color: '#1C1B1F',
  },
  likeIcon: {
    fontSize: 24, // Altere o tamanho conforme necessário
    marginLeft: 10,
    marginRight: 55,
    position: 'absolute',
    top: 0,
    //left: 0,
  },
  bpmLabel: {
    fontSize: 15, // Tamanho do texto "BPM"
    color: '#1C1B1F',
    position: 'absolute',
    top: -5, // Ajuste a posição vertical conforme necessário
    left: 8, // Ajuste a posição horizontal conforme necessário
    paddingLeft: -10, // Adiciona espaço entre o ícone e o texto "Segunda"
  },
});

export default PerfilRoute; // A exportação deve corresponder ao nome do componente
