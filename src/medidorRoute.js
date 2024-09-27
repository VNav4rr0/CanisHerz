import React, { useState } from "react";
import { Text, StyleSheet, View, ScrollView, ImageBackground } from "react-native";
import { Button, Icon, Modal, Portal, Provider, List } from 'react-native-paper';

const MedidorRoute = () => {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false); // Para controlar o dropdown

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const handlePress = () => setExpanded(!expanded); // Função para alternar expandir/colapsar

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Cabeçalho com imagem de fundo e bordas arredondadas */}
        <ImageBackground
          source={require('../assets/header.png')}
          style={styles.headerBackground}
          imageStyle={styles.headerImage}
        >
          <View style={styles.overlay}>
            <Text style={styles.petName}>Pitico</Text>
          </View>
        </ImageBackground>

        {/* Informações fora do background */}
        <View style={styles.infoContainer}>
          <Text style={styles.petInfo}>Informações do Cão</Text>
          <Text style={styles.petDetails}>Peso: 30kg</Text>
          <Text style={styles.petDetails}>Idade: 1 ano</Text>
        </View>

        {/* Seção de Cães cadastrados */}
        <List.Section>
          <List.Accordion
            title="Cães cadastrados"
            expanded={expanded}
            onPress={handlePress}
            style={styles.accordion} // Aplicando o estilo personalizado no Accordion
            titleStyle={styles.accordionTitle} // Estilo do texto do título
          >
            {/* List.Items clicáveis, mas sem funcionalidade */}
            <List.Item
              title="Pitico"
              style={styles.listItem} // Estilo aplicado aos itens da lista
              titleStyle={styles.listItemTitle} // Estilo do título dentro do List.Item
            />
            <List.Item
              title="Thor"
              style={styles.listItem}
              titleStyle={styles.listItemTitle}
            />
            <List.Item
              title="Max"
              style={styles.listItem}
              titleStyle={styles.listItemTitle}
            />
          </List.Accordion>
          
          {/* Texto fora do Accordion, abaixo do título */}
          {!expanded && (
            <Text style={styles.instructionText}>
              Selecione o cão desejado para medir a frequência cardíaca.
            </Text>
          )}
        </List.Section>

        {/* BPM e botão de instruções */}
        <View style={styles.container}>

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

        {/* Modal de Instruções */}
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
              {'\n\n\n'}
              Essas dicas são baseadas em especialistas como Dr. Travis Arndt e Dr. Eric Van Nice, que reforçam a importância de agir rápido e manter o cão calmo até chegar à clínica.
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
  headerBackground: {
    padding: 10,
    borderRadius: 10,
    margin: 0,
    justifyContent: 'flex-end',
    height: 350,
    marginTop: -200,
  },
  headerImage: {
    borderRadius: 18,
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    left: 20,
  },
  petName: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '400',
  },

  infoContainer: {
    padding: 18,
    backgroundColor: "#F4F4F4", // Cor mais escura que o branco
    borderBottomLeftRadius: 18,  // Arredondado somente na parte inferior
    borderBottomRightRadius: 18, // Arredondado somente na parte inferior
    marginHorizontal: 2, // Diminui a margem lateral para deixar mais largo
    marginVertical: 37,
    marginTop: -0,
    borderWidth: 1,  // Aumente o valor para tornar a borda mais espessa
    borderColor: '#000',  // Cor preta para a borda (pode mudar a cor se necessário)
  },
  
  petInfo: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
    paddingBottom: 10,
  },
  petDetails: {
    fontSize: 16,
    color: '#6D6D6D', // Cor suave para os detalhes
    textAlign: 'left',
  },
  container: {
    paddingHorizontal: 24,
    backgroundColor: "#FFF",
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
    borderWidth: 1,  // Aumente o valor para tornar a borda mais espessa
    borderColor: '#000',  // Cor preta para a borda (pode mudar a cor se necessário)
  },
  bpmContent: {
    alignItems: "flex-start",
  },
  bpmValue: {
    fontSize: 60,
    fontWeight: '450',
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
  // Estilos do accordion
  accordion: {
    borderWidth: 1, // Borda mais espessa
    borderColor: '#000', // Cor preta para o contorno
    borderRadius: 26, // Bordas arredondadas
    marginVertical: 10,
    marginHorizontal: 22,
    backgroundColor: '#F4F4F4', // Cor de fundo mais suave
  },
  accordionTitle: {
    fontWeight: 'bold', // Negrito no texto do título
    fontSize: 18,
    color: '#1c1b1f',
  },
  // Estilo para o texto de instrução
  instructionText: {
    fontSize: 14,
    color: "#6D6D6D",
    textAlign: "center",
    marginVertical: 5,
    paddingHorizontal: 15,
  },
  // Estilos para os itens da lista
  listItem: {
    backgroundColor: "#FFF", // Cor de fundo dos itens da lista
    borderBottomWidth: 1, // Linha de separação entre os itens
    borderBottomColor: "#E0E0E0", // Cor da linha de separação
    paddingVertical: 10, // Espaçamento vertical
    paddingHorizontal: 15, // Espaçamento horizontal
  },
  listItemTitle: {
    fontSize: 16, // Tamanho da fonte dos títulos
    color: "#1c1b1f", // Cor do texto dos itens da lista
    fontWeight: '500', // Peso da fonte dos títulos
  },
});

export default MedidorRoute;
