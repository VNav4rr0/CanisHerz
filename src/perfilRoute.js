import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, ScrollView, ImageBackground, LayoutAnimation, Platform, UIManager } from "react-native";
import { Provider, List, Icon, Appbar, } from 'react-native-paper';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const perfilRoute = () => {
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

  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
  return (
    <Provider contentContainerStyle={styles.scrollViewContainer}>
      <ScrollView >
        <ImageBackground
          source={require('../assets/header.png')}
          style={styles.headerBackground}
          imageStyle={styles.headerImage}
        >

          <Appbar.Header style={styles.header}>
            <Appbar.Content />
            <Appbar.Action icon="plus" onPress={() => {}} color="#fff" />
            <Appbar.Action style={styles.btn} mode="contained"icon="pencil" onPress={() => {}}  color="#fff" />
        </Appbar.Header>
          <View style={styles.overlay}>
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
            <View style={styles.accordionItemContainer} >
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



        <View style={styles.container}>
          <View style={styles.bpmContainer}>
            <View style={styles.heartContainer}>
            <Text style={styles.bpmLabel}><Icon source="thumb-up" size={22} style={styles.likeIcon} /> Segunda</Text>
            <Text style={styles.bpmText}>100 BPM</Text>
              <View style={styles.iconC}>
              </View>
            </View>
            <Text style={styles.resultado}><Icon source="check" size={16} style={styles.heartIcon} /> Normal </Text>
          </View>
        </View>

          
        
        <View style={styles.container}>
          <View style={styles.bpmContainer}>
            <View style={styles.heartContainer}>
            <Text style={styles.bpmLabel}><Icon source="thumb-up" size={22} style={styles.likeIcon} /> Segunda</Text>
            <Text style={styles.bpmText}>100 BPM</Text>
              <View style={styles.iconC}>
              </View>
            </View>
            <Text style={styles.resultado}><Icon source="check" size={16} style={styles.heartIcon} /> Normal </Text>
          </View>
        </View>

           
        
        <View style={styles.container}>
          <View style={styles.bpmContainer}>
            <View style={styles.heartContainer}>
            <Text style={styles.bpmLabel}><Icon source="thumb-up" size={22} style={styles.likeIcon} /> Segunda</Text>
            <Text style={styles.bpmText}>100 BPM</Text>
              <View style={styles.iconC}>
              </View>
            </View>
            <Text style={styles.resultado}><Icon source="check" size={16} style={styles.heartIcon} /> Normal </Text>
          </View>
        </View>

      

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
    marginBottom: 10,
  },

  header: {
    backgroundColor: 'rgba(0, 0, 0, 0)', // Transparente
   
    borderBottomWidth: 0, // Remove a linha inferior
    paddingBottom: 0, // Remove o padding inferior
    marginBottom: 0, // Remove o margin inferior
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
  btn:{
    backgroundColor:"#E81616",
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

  },
  bpmText: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    fontSize: 34,
    color: '#1C1B1F',
  },
  iconC: {
    display: 'flex',
    justifyContent: 'start',
    height: 20,
  },
  likeIcon: {
    fontSize: 24, // Altere o tamanho conforme necessário
    marginLeft: 10,
    marginRight: 55,
    position: 'absolute',
    top: 0,
    left: 0,
},

  bpmLabel: {
    fontSize: 14, // Tamanho do texto "BPM"
    color: '#1C1B1F',
    position: 'absolute',
    top: -5, // Ajuste a posição vertical conforme necessário
    left: 8, // Ajuste a posição horizontal conforme necessário
    paddingLeft: -10, // Adiciona espaço entre o ícone e o texto "Segunda"
  },
  
  
  button: {
    backgroundColor: '#8B0000',
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
    backgroundColor: '#8B0000',
    width: 'auto',
  },
});

export default perfilRoute;
