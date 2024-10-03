import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button, Provider, Icon, Card, IconButton } from 'react-native-paper';

const HomeRoute = () => (
  <Provider>
    <ImageBackground style={[styles.capa, { borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }]} source={require('../assets/capa3.png')} >
      <view>
        
      </view>
      <Image style={styles.dog} source={require('../assets/unsplash_WX4i1Jq_o0Y.png')} />
    </ImageBackground>
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.column2}>
          <Card mode='outlined' style={[styles.card, { height: 140, backgroundColor: '#FFF8F7', borderRadius: 24 }]}>
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
          <Card mode='outlined' style={[styles.cont, { backgroundColor: '#FFF8F7', width: '100%', borderRadius: 32 }]}>
            <Card.Content style={styles.conteu} >
              <Icon
                source="battery-off-outline"
                size={64}
              />
              <Text>0</Text>
            </Card.Content>
          </Card>
        </View>
      </View>
      <Card mode='outlined' style={[styles.card, { width: "100%", backgroundColor: '#FFF8F7', borderRadius: 24 }]}>
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
    height: 390,
    position:'relative',
    overflow:'hidden',
  },
  dog:{
    position:'absolute',
    right:-20,
    Button:100,
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
    gap: 16,
  },

  cont: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 'auto',

  },
  conteu: {
    width: '100%',
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
