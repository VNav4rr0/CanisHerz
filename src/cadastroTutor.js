import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, ImageBackground, ToastAndroid } from 'react-native';
import { TextInput, Button, Provider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from './firebaseConfig'; 


const CadastroTutor = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const navigation = useNavigation();

    const handleCadastrar = async () => {
        if (password === confirmPassword) {
            try {
                // Cadastro no Firebase Authentication
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const userId = userCredential.user.uid;

                // Armazenando dados adicionais no Firestore
                await firestore.collection('Tutores').doc(userId).set({
                    Email: email,   
                    Nome: nome, 
                });

                ToastAndroid.show("Cadastro realizado com sucesso!", ToastAndroid.SHORT);
                navigation.navigate('AddNovosDogs'); // Navega para a tela AddNovosDogs

            } catch (error) {
                console.error("Erro de autenticação:", error);
                setErrorMessage("Erro ao cadastrar. Tente novamente.");
            }
        } else {
            setErrorMessage("As senhas não coincidem!");
        }

        if (errorMessage) {
            ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        }
    };

    return (
        <Provider>
            <ImageBackground source={require('../assets/patas.png')} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.form}>
                        <View style={styles.inputCont}>
                            <Text style={styles.title}>Cadastro</Text>
                            <Text style={styles.text}>Para começar, cadastre suas informações.</Text>
                            <TextInput
                                label="Nome"
                                value={nome}
                                onChangeText={setNome}
                                style={styles.input}
                                autoCapitalize="words"
                                theme={{ colors: { primary: '#900C0A' } }}
                            />
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
                                label="Criar Senha"
                                value={password}
                                onChangeText={setPassword}
                                style={styles.input}
                                secureTextEntry
                                theme={{ colors: { primary: '#900C0A' } }}
                            />
                            <TextInput
                                label="Confirmar Senha"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                style={styles.input}
                                secureTextEntry
                                theme={{ colors: { primary: '#900C0A' } }}
                            />
                        </View>
                    </View>
                    <Button mode="contained" style={styles.button} onPress={handleCadastrar}>
                        Adicione o seu cachorro 
                    </Button>
                </ScrollView>
            </ImageBackground>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    form: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    scrollContent: {
        padding: 16,
        flexGrow: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFF',
    },
    text: {
        fontSize: 20,
        color: '#FFF',
        marginBottom: 48,
    },
    input: {
        backgroundColor: '#FFF',
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
        backgroundColor: '#B3261E',
    },
});

export default CadastroTutor;
