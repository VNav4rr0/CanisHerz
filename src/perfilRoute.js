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
  Alert,
  button,
} from "react-native";
import { Provider, List, Appbar, Icon, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { firestore, auth } from "./firebaseConfig";

const PerfilRoute = () => {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);
  const [selectedDog, setSelectedDog] = useState(null);
  const [dogs, setDogs] = useState([]);
  const [tutorName, setTutorName] = useState("");

  // Enable animation for Android
  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  // Function to fetch profile data of the tutor
  const fetchProfileData = () => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const docRef = doc(firestore, "Tutores", userId);

      // Use onSnapshot to listen for changes in the tutor document
      onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setTutorName(docSnap.data().Nome || "Usuário");
          }
        },
        (error) => {
          console.error("Error fetching tutor data:", error);
        }
      );
    }
  };

  const fetchDogs = () => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const dogsCol = collection(firestore, "Tutores", userId, "Cachorros");

      const unsubscribe = onSnapshot(
        dogsCol,
        (snapshot) => {
          const dogsList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setDogs(dogsList);
        },
        (error) => {
          console.error("Error fetching dogs data:", error);
        }
      );

      return unsubscribe;
    }
  };

  useEffect(() => {
    fetchProfileData();
    const unsubscribeDogs = fetchDogs();
    return () => {
      if (unsubscribeDogs) unsubscribeDogs();
    };
  }, []);

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const selectDog = (dog) => {
    setSelectedDog(dog);
  };

  const handlePresseditarRoute = () => {
    if (!selectedDog) {
      Alert.alert(
        "Atenção",
        "Por favor, selecione um cachorro antes de editar."
      );
    } else {
      navigation.navigate("EditarRoute", { dog: selectedDog });
    }
  };

  const handlePressAddNovosDogs = () => {
    navigation.navigate("AddNovosDogs");
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        Alert.alert("Sucesso", "Você saiu da conta.");
        navigation.navigate("Login"); // Redirecionar para a tela de login
      })
      .catch((error) => {
        Alert.alert("Erro", error.message);
      });
  };

  const handleDeleteAccount = () => {
    const user = auth.currentUser;
    if (user) {
      Alert.alert(
        "Confirmação",
        "Você tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Excluir",
            onPress: () => {
              user
                .delete()
                .then(() => {
                  Alert.alert(
                    "Conta excluída",
                    "Sua conta foi excluída com sucesso."
                  );
                  navigation.navigate("Login"); // Redirecionar para a tela de login
                })
                .catch((error) => {
                  Alert.alert("Erro", error.message);
                });
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <ImageBackground
          source={require("../assets/header.png")}
          style={styles.headerBackground}
          imageStyle={styles.headerImage}
        >
          <View style={styles.overlay}>
            <Appbar.Header style={styles.header}>
              <Appbar.Content />
              <Appbar.Action
                icon="plus"
                onPress={handlePressAddNovosDogs}
                color="#fff"
              />
              <Appbar.Action
                style={styles.btn}
                mode="contained"
                icon="pencil"
                onPress={handlePresseditarRoute}
                color="#fff"
                disabled={!selectedDog}
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
            description={
              selectedDog
                ? `Cão selecionado: ${selectedDog.Apelido}`
                : "Selecione um cão para medir os batimentos"
            }
          >
            <View style={styles.accordionItemContainer}>
              <ScrollView style={styles.accordionItemsScroll}>
                {dogs.map((dog) => (
                  <List.Item
                    key={dog.id}
                    title={dog.Apelido}
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

        {Array(4)
          .fill()
          .map((_, index) => (
            <View key={index} style={styles.container}>
              <View style={styles.bpmContainer}>
                <View style={styles.heartContainer}>
                  <Text style={styles.bpmLabel}>
                    <Icon source="thumb-up" size={17} style={styles.likeIcon} />{" "}
                    Segunda
                  </Text>
                  <Text style={styles.bpmText}>100 BPM</Text>
                </View>
                <Text style={styles.resultado}>
                  <Icon source="check" size={16} style={styles.heartIcon} />{" "}
                  Normal
                </Text>
              </View>
            </View>
          ))}
      <View style={styles.deleteAccountContainer}>
        <Button mode="contained" icon="logout" onPress={handleLogout} style={styles.button} labelStyle={styles.label}>Sair da Conta</Button>
        <Button mode="contained" icon="delete" onPress={handleDeleteAccount} style={styles.button} labelStyle={styles.label} >Excluir Conta</Button>
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
    fontWeight: "bold",
    color: "#232323",
    marginBottom: 19,
  },
  header: {
    backgroundColor: "rgba(0, 0, 0, 0)",
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
    width: "100%",
    height: 250,
    overflow: "hidden",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  btn: {
    backgroundColor: "#E81616",
  },
  headerImage: {
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    backgroundColor: "rgba(139, 0, 0, 0.6)",
    padding: 20,
  },
  petName: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  customAccordion: {
    backgroundColor: "#FFF8F7",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#808080",
  },
  accordionTitle: {
    fontSize: 18,
    color: "#232323",
    fontWeight: "bold",
  },
  accordionItemsScroll: {
    maxHeight: 150,
  },
  accordionItemContainer: {
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#808080",
    width: "auto",
    marginHorizontal: 20,
  },
  accordionItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#808080",
    backgroundColor: "#FFF8F7",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 1,
  },
  bpmContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#FFF8F7",
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#808080",
  },
  resultado: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: 16,
  },
  heartContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  bpmText: {
    paddingHorizontal: 10,
    paddingVertical: 19,
    fontSize: 24,
    color: "#232323",
  },
  deleteAccountContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#BE0C12", // A mesma cor que você usa em MedidorRoute
    marginBottom: 20,
  },
  label: {
    color: "#fff",
  },
});

export default PerfilRoute;
