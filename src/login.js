import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, ImageBackground, Animated, TouchableWithoutFeedback } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { TextInput, Button, Provider, IconButton, Portal, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// Prevent auto-hide of splash screen
SplashScreen.preventAutoHideAsync();

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleCadastrar = () => {
        navigation.navigate('CadastroTutor');
    };



    return (
        <Provider>
            <ImageBackground source={require('../assets/back_login.png')} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.titleCont}>
                        <IconButton
                            icon="arrow-left"
                            onPress={handleGoBack}
                            size={24}
                            iconColor="#fff"
                            style={styles.backButton}
                        />

                    </View>
                    <View style={styles.form}>
                        <Text style={styles.title}>
                            Entrar
                        </Text>
                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            autoCapitalize="none"
                            autoCompleteType="email"
                            textContentType="emailAddress"
                            keyboardType="email-address"
                            theme={{ colors: { primary: '#900C0A' } }}

                        />
                        <TextInput
                            label="Senha"
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            secureTextEntry
                            theme={{ colors: { primary: '#900C0A' } }}
                        />
                        <Button mode="text" style={styles.esqueceu} labelStyle={{ color: '#fff', fontSize: 16 }} >Esqueceu a Senha?</Button>

                    </View>

                    <View>
                        <Button mode="outlined" labelStyle={{ color: '#fff', fontSize: 16 }} style={{ borderColor: '#fff' }} onPress={handleCadastrar}>Cadastrar-se</Button>
                        <Button mode="contained" style={styles.button} labelStyle={{ color: '#fff', fontSize: 16  }} >Entrar</Button>
                    </View>

                </ScrollView>
            </ImageBackground>
        </Provider>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    form: {
        paddingTop: 200,
        justifiySelf : 'flex-end',
    },
    titleCont: {
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: -10,
        top: 0,
    },
    scrollContent: {
        padding: 16,
        paddingTop: 64,
        flexGrow: 1,
        justifyContent: 'space-between',
    },

    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 50,
    },

    input: {
        backgroundColor: '#FFF',
        marginBottom: 16,
    },
    esqueceu: {
        alignSelf: 'flex-start',
    },
    cadastrar: {
        alignSelf: 'flex-start',
        marginTop: 10,
    },
    button: {
        marginTop: 16,
        backgroundColor: '#B3261E',
        height: 40,
        paddingVertical: 0,
        paddingHorizontal: 10,
        alignSelf: 'center',
        width: '100%',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    modalButton: {
        marginTop: 20,
        backgroundColor: '#D64235',
    },
});


