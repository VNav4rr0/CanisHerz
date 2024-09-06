import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button, Provider, Icon, Card, IconButton } from 'react-native-paper';

const HomeRoute = () => (
  <Provider>
    <Image style={[styles.capa, { borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }]} source={require('../assets/capa3.png')} />
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.column2}>
          <Card mode='contained' style={[styles.card, { height: 140, backgroundColor: '#f5f5f5' }]}>
            <Card.Title
              title="Dispositivo"
              right={(props) => <IconButton {...props} icon="access-point-off" size={24} />}
            />
            <Card.Content>
              <Text style={{ fontSize: 25 }}>Não Conectado</Text>
            </Card.Content>
          </Card>
          <Button buttonColor="#BE0C12" mode="contained">Contained</Button>
        </View>
        <View style={styles.column}>
          <Card mode='contained' style={[styles.card, { backgroundColor: '#f5f5f5' }]}>
            <Card.Content style={styles.cont}>
              <Icon
                source="battery-off-outline"
                size={48}
              />
            </Card.Content>
          </Card>
        </View>
      </View>
      <Card mode='contained' style={[styles.card, { width:"100", backgroundColor: '#f5f5f5' }]}>
            <Card.Title
              title="Aviso"
            />
            <Card.Content>
              <Text style={{ fontSize: 20 }}>Se houver outro canino, adicione-o na página 'Conta' do app.</Text>
            </Card.Content>
          </Card>
    </View>
  </Provider>
);

const styles = StyleSheet.create({
  capa: {
    width: '100%',
    height: '50%',
  },
  container: {
    flex: 1,
    gap: 24,
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  row: {
    flexDirection: 'row-reverse',
    display: 'flex',
    alignContent: 'space-around',
    height: 200,
    width: '100%',
  },
  cont: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  column: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '100%',
  },
  column2: {
    flex: 2,
    width: '50%',
    height: '100%',
    justifyContent: 'space-between',
  },
});

export default HomeRoute;
