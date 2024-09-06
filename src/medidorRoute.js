import React, { useState } from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { Card, Button, Icon, Modal, Portal, Provider } from 'react-native-paper';

const MedidorRoute = () => {
  const [selected, setSelected] = useState("Inicio");
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.cardContainer}>
          <Card>
            <Card.Cover style={styles.img} source={require("../assets/Pitico.png")} />
            <View style={styles.overlay}>
              <Text style={styles.selectText}>Selecione</Text>
              <Text style={styles.petName}>Pitico</Text>
            </View>
          </Card>
        </View>
        
        <View style={styles.container}>
          <Text style={styles.equipmentText}>
            Certifique-se de que o equipamento está devidamente equipado.
          </Text>

          <View style={styles.bpmContainer}>
            <View style={styles.bpmContent}>
              <Text style={styles.bpmLabel}>BPM</Text>
              <View style={styles.bpmRow}>
                <Text style={styles.bpmValue}>60</Text>
                <Icon source="heart" size={24} color="#B3261E" style={styles.heart} />
              </View>
            </View>
            <View style={styles.statusContent}>
              <View style={styles.statusRow}>
                <Icon source="check" size={24} color="#000000" style={styles.checkIcon} />
                <Text style={styles.statusText}>Normal</Text>
              </View>
            </View>
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
              Monitoramento: Acompanhe os dados de saúde cardíaca do seu cão diretamente no aplicativo.
            </Text>
            <Button onPress={hideModal} mode="contained" style={styles.closeButton}>
              Voltar
            </Button>
          </Modal>
        </Portal>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  cardContainer: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  selectText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  petName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    paddingHorizontal: 24,
    backgroundColor: "#FFF",
  },
  img: {
    height: 400,
    marginTop: -120,
  },
  equipmentText: {
    fontSize: 22,
    color: "#1c1b1f",
    textAlign: "center",
    marginVertical: 30,
  },
  bpmContainer: {
    backgroundColor: "#F4F4F4",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  bpmContent: {
    alignItems: "flex-start",
  },
  bpmValue: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#1c1b1f",
  },
  bpmLabel: {
    fontSize: 18,
    color: "#1c1b1f",
    marginTop: -10,
  },
  bpmRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  heart: {
    marginLeft: 8,
    position: "relative",
    top: -20,
  },
  statusContent: {
    position: "relative",
    height: "100%",
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: "#1c1b1f",
    fontWeight: "500",
    marginLeft: 8,
  },
  checkIcon: {
    marginRight: 8,
  },
  button: {
    backgroundColor: '#B3261E',
    marginVertical: 24,
    elevation: 0, // Remove a sombra no Android
    shadowColor: 'transparent', // Remove a sombra no iOS
    shadowOffset: { width: 0, height: 0 }, // Remove a sombra no iOS
    shadowOpacity: 0, // Remove a sombra no iOS
    shadowRadius: 0, // Remove a sombra no iOS
  },
  label: {
    color: '#ffffff',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#B3261E',
    height: "auto",
    width: "auto",
    alignSelf: 'flex-end',
  },
});

export default MedidorRoute;
