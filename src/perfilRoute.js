import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, ScrollView, ImageBackground, LayoutAnimation, Platform, UIManager, Alert } from 'react-native';
import { Provider, List, Appbar, Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { firestore, auth } from './firebaseConfig';

const PerfilRoute = () => {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);
  const [selectedDog, setSelectedDog] = useState(null);
  const [dogs, setDogs] = useState([]);
  const [tutorName, setTutorName] = useState('');

  // Enable animation for Android
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  // Function to fetch profile data of the tutor
  const fetchProfileData = () => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const docRef = doc(firestore, 'Tutores', userId);

      // Use onSnapshot to listen for changes in the tutor document
      onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setTutorName(docSnap.data().Nome || 'Usuário'); // Use 'Nome' to get the correct name
        }
      }, (error) => {
        console.error('Error fetching tutor data:', error);
      });
    }
  };

  const fetchDogs = () => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const dogsCol = collection(firestore, 'Tutores', userId, 'Cachorros');

      // Using onSnapshot to listen for changes in the dogs collection
      const unsubscribe = onSnapshot(dogsCol, (snapshot) => {
        const dogsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDogs(dogsList); // Update the list of dogs
      }, (error) => {
        console.error('Error fetching dogs data:', error);
      });

      // Return the unsubscribe function to stop listening on component unmount
      return unsubscribe;
    }
  };

  // useEffect to fetch profile and dogs data when the component mounts
  useEffect(() => {
    fetchProfileData();
    const unsubscribeDogs = fetchDogs();

    // Cleanup the unsubscribe function on unmount
    return () => {
      if (unsubscribeDogs) unsubscribeDogs();
    };
  }, []);

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const selectDog = (dog) => {
    setSelectedDog(dog); // Update the selected dog
  };

  const handlePresseditarRoute = () => {
    if (!selectedDog) {
      Alert.alert('Atenção', 'Por favor, selecione um cachorro antes de editar.'); // Alert if no dog is selected
    } else {
      navigation.navigate('EditarRoute', { dog: selectedDog }); // Pass the selected dog data
    }
  };

  const handlePressAddNovosDogs = () => {
    navigation.navigate('AddNovosDogs');
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <ImageBackground source={require('../assets/header.png')} style={styles.headerBackground} imageStyle={styles.headerImage}>
          <View style={styles.overlay}>
            <Appbar.Header style={styles.header}>
              <Appbar.Content />
              <Appbar.Action icon="plus" onPress={handlePressAddNovosDogs} color="#fff" />
              <Appbar.Action 
                style={styles.btn} 
                mode="contained" 
                icon="pencil" 
                onPress={handlePresseditarRoute} 
                color="#fff" 
                disabled={!selectedDog} // Disable button if no dog is selected
              />
            </Appbar.Header>
            <Text style={styles.petName}>{tutorName}</Text>
          </View>
        </ImageBackground>

        <List.Section>
          <List.Accordion
            title="Cães cadastrados"
            expanded={expanded}
            onPress={handlePress}
            style={styles.customAccordion}
            titleStyle={styles.accordionTitle}
            description={selectedDog ? `Cão selecionado: ${selectedDog.Apelido}` : 'Selecione um cão para medir os batimentos'}
          >
            <View style={styles.accordionItemContainer}>
              <ScrollView style={styles.accordionItemsScroll}>
                {dogs.map((dog) => (
                  <List.Item 
                    key={dog.id} // Use ID as unique key
                    title={dog.Apelido} // Display the dog's nickname
                    style={styles.accordionItem} 
                    onPress={() => selectDog(dog)} // Select the dog
                  />
                ))}
              </ScrollView>
            </View>
          </List.Accordion>
        </List.Section>

        <View style={styles.cardioSection}>
          <Text style={styles.cardioTitle}>Dados Cardíacos</Text>
        </View>

        {/* Heart Data */}
        {Array(4).fill().map((_, index) => (
          <View key={index} style={styles.container}>
            <View style={styles.bpmContainer}>
              <View style={styles.heartContainer}>
                <Text style={styles.bpmLabel}>
                  <Icon source="thumb-up" size={17} style={styles.likeIcon} /> Segunda
                </Text>
                <Text style={styles.bpmText}>100 BPM</Text>
              </View>
              <Text style={styles.resultado}>
                <Icon source="check" size={16} style={styles.heartIcon} /> Normal 
              </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0)',
    marginHorizontal: "auto",
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginBottom: 89,
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
    maxHeight: 150,
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
    fontSize: 24,
    marginLeft: 10,
    marginRight: 55,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  bpmLabel: {
    fontSize: 15,
    color: '#1C1B1F',
    position: 'absolute',
    top: -5,
    left: 8,
  },
});

export default PerfilRoute;
