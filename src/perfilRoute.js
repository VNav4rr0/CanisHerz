import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, ScrollView, ImageBackground, LayoutAnimation, Platform, UIManager, Alert } from "react-native";
import { Provider, List, Appbar, Icon, Button, FAB, Portal, Modal, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { doc, onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { firestore, auth } from "./firebaseConfig";

const PerfilRoute = () => {

  const customTheme = {
    colors: {
      primary: "rgb(180, 39, 31)",
      onPrimary: "rgb(255, 255, 255)",
      primaryContainer: "rgb(255, 218, 213)",
      onPrimaryContainer: "rgb(65, 0, 1)",
      secondary: "rgb(156, 65, 64)",
      onSecondary: "rgb(255, 255, 255)",
      secondaryContainer: "#F9DEDC",
      onSecondaryContainer: "rgb(65, 0, 5)",
      tertiary: "rgb(112, 92, 46)",
      onTertiary: "rgb(255, 255, 255)",
      tertiaryContainer: "rgb(252, 223, 166)",
      onTertiaryContainer: "rgb(38, 26, 0)",
      error: "rgb(186, 26, 26)",
      onError: "rgb(255, 255, 255)",
      errorContainer: "rgb(255, 218, 214)",
      onErrorContainer: "rgb(65, 0, 2)",
      background: "rgb(255, 251, 255)",
      onBackground: "rgb(32, 26, 25)",
      surface: "rgb(255, 251, 255)",
      onSurface: "rgb(32, 26, 25)",
      surfaceVariant: "rgb(245, 221, 218)",
      onSurfaceVariant: "rgb(83, 67, 65)",
      outline: "rgb(133, 115, 112)",
      outlineVariant: "rgb(216, 194, 190)",
      shadow: "rgb(0, 0, 0)",
      scrim: "rgb(0, 0, 0)",
      inverseSurface: "rgb(54, 47, 46)",
      inverseOnSurface: "rgb(251, 238, 236)",
      inversePrimary: "rgb(255, 180, 170)",
      elevation: {
        level0: "transparent",
        level1: "rgb(251, 240, 244)",
        level2: "rgb(249, 234, 237)",
        level3: "rgb(247, 228, 230)",
        level4: "rgb(246, 226, 228)",
        level5: "rgb(245, 221, 224)"
      },
      surfaceDisabled: "rgba(32, 26, 25, 0.12)",
      onSurfaceDisabled: "rgba(32, 26, 25, 0.38)",
      backdrop: "rgba(59, 45, 43, 0.4)"
    }
  };

  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);
  const [selectedDog, setSelectedDog] = useState(null);
  const [dogs, setDogs] = useState([]);
  const [tutorName, setTutorName] = useState("");
  const [dogCardioData, setDogCardioData] = useState({}); // Stores cardio data for each dog

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
            setTutorName(docSnap.data().Nome || "Usuário"); // Nome ou valor padrão
          }
        },
        (error) => {
          console.error("Error fetching tutor data:", error);
          setTutorName("Usuário"); // Em caso de erro, definir um nome padrão
        }
      );
    }
  };
  const fetchAllCardioData = (dogsList) => {
    const user = auth.currentUser;
    if (!user) return;

    const userId = user.uid;
    const cardioData = {};

    dogsList.forEach((dog) => {
      const cardioRef = collection(firestore, "Tutores", userId, "Cachorros", dog.id, "DadosDiarios");
      const q = query(cardioRef, orderBy("Data", "desc"));

      onSnapshot(q, (snapshot) => {
        cardioData[dog.id] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setDogCardioData({ ...cardioData });
      }, (error) => {
        console.error("Error fetching cardio data:", error);
      });
    });
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
          fetchAllCardioData(dogsList);
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

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        Alert.alert("Sucesso", "Você saiu da conta.");
        navigation.navigate("Login");
      })
      .catch((error) => {
        Alert.alert("Erro", error.message);
      });
  };

  // Lógica para confirmar exclusão
  const [password, setPassword] = useState(''); // Armazena a senha digitada
  const [isModalVisible, setIsModalVisible] = useState(false); // Controle do modal
  const handleLogoutAction = () => {
    console.log('Realizando logout...');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Boasvindas' }],
    });
  };

  const handleDeleteAccount = () => {
    setIsModalVisible(true); // Abre o modal
  };

  // Lógica para confirmar exclusão
  const confirmDeleteAccount = () => {
    if (password === 'senhaCorreta') {
      console.log('Conta excluída com sucesso!');
      Alert.alert('Sucesso', 'Conta excluída!');
      setIsModalVisible(false); // Fecha o modal
    } else {
      Alert.alert('Erro', 'Senha incorreta. Tente novamente.');
    }
  };

  return (
    <Provider theme={customTheme}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>

        <ImageBackground
          source={require("../assets/header.png")}
          style={styles.headerBackground}
          imageStyle={styles.headerImage}
        >
          <View style={styles.overlay}>
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
          {selectedDog && dogCardioData[selectedDog.id] ? (
            dogCardioData[selectedDog.id].map((data) => (
              <View key={data.id} style={styles.bpmContainer}>
                <View style={styles.heartContainer}>
                  <Text style={styles.bpmLabel}>Data: {new Date(data.Data.seconds * 1000).toLocaleDateString()}</Text>
                  <Text style={styles.bpmText}>Média: {data.Media} BPM</Text>
                </View>
                <Text style={styles.resultado}>
                  Alto: {data.AltoPico} BPM | Baixo: {data.BaixoPico} BPM
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.cardioText}>Selecione um cão para ver os dados.</Text>
          )}
        </View>
        <View style={styles.deleteAccountContainer}>

          <Portal>
            <FAB.Group
              theme={{
                colors: {
                  primary: 'green',  // Cor do ícone quando o FAB está fechado
                  onPrimary: 'white', // Cor do ícone quando o FAB está aberto
                },
              }}
              open={open}
              visible={true} // Controla a visibilidade do FAB
              icon={open ? 'close' : 'dots-vertical'}
              actions={[
                {
                  icon: 'pencil',
                  label: 'Editar Perfil',
                  onPress: handlePresseditarRoute, // Chamando diretamente a função
                },
                {
                  icon: 'dog',
                  label: 'Adicionar Cães',
                  onPress: handlePressAddNovosDogs, // Chamando diretamente a função
                },
                {
                  icon: 'logout',
                  label: 'Sair',
                  onPress: handleLogout, // Chamando diretamente a função
                },
                {
                  icon: 'delete',
                  label: 'Excluir Conta',
                  onPress: handleDeleteAccount,
                },
              ]}
              onStateChange={onStateChange}
              onPress={() => {
                if (open) {
                  console.log('FAB aberto, ações adicionais...');
                } else {
                  console.log('FAB fechado');
                }
              }}
            />

          </Portal>
        </View>
        <Portal>
          <Modal
            visible={isModalVisible}
            onDismiss={() => setIsModalVisible(false)}
            contentContainerStyle={styles.modalContent}
          >
            <Text style={styles.modalTitle}>Confirme sua Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.buttonsContainer}>
              <Button
                mode="contained"
                onPress={confirmDeleteAccount}
                style={styles.button}
              >
                Confirmar
              </Button>
              <Button
                mode="text"
                onPress={() => setIsModalVisible(false)}
                style={styles.button}
              >
                Cancelar
              </Button>
            </View>
          </Modal>
        </Portal>
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
    margin: 10,
  },

  bpmText: {
    paddingHorizontal: 10,
    paddingVertical: 19,
    fontSize: 32,
    color: "#232323",
  },
  bpmLabel: {
    gap: 24,
    display: 'flex',
    marginLeft: 2,
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

  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 40,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default PerfilRoute;
