import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, ImageBackground, Alert } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { TextInput, Button, Provider, IconButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore, auth } from './firebaseConfig';
import { updateEmail, updatePassword } from 'firebase/auth';

// Prevent auto-hide of splash screen
SplashScreen.preventAutoHideAsync();

export default function EditarRoute() {
    const navigation = useNavigation();
    const route = useRoute();
    const { dog, tutor } = route.params || {};

    // State variables
    const [nickname, setNickname] = useState(dog.Apelido || '');
    const [birthDate, setBirthDate] = useState(dog.Nascimento || '');
    const [weight, setWeight] = useState(dog.Peso || '');
    const [size, setSize] = useState(dog.Porte || '');
    const [tutorName, setTutorName] = useState(tutor ? tutor.Nome : '');
    const [email, setEmail] = useState(tutor ? tutor.Email : '');
    const [password, setPassword] = useState('');

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleUpdateDog = async () => {
        try {
            // Validate dog details
            if (!nickname.trim()) {
                Alert.alert("Erro", "O apelido do cachorro não pode estar em branco.");
                return;
            }

            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const dogRef = doc(firestore, 'Tutores', userId, 'Cachorros', dog.id);

                // Update dog details
                await updateDoc(dogRef, {
                    Apelido: nickname,
                    DataDeNascimento: birthDate,
                    Peso: weight,
                    Porte: size,
                });

                Alert.alert("Sucesso", "As informações do cachorro foram atualizadas com sucesso!");
                navigation.goBack();
            }
        } catch (error) {
            console.error('Erro ao atualizar as informações do cachorro:', error);
            Alert.alert("Erro", "Ocorreu um erro ao atualizar as informações do cachorro: " + error.message);
        }
    };

    const handleUpdateTutor = async () => {
        try {
            // Validate tutor details
            if (!tutorName.trim()) {
                Alert.alert("Erro", "O nome do tutor não pode estar em branco.");
                return;
            }

            if (!email.trim()) {
                Alert.alert("Erro", "O email não pode estar em branco.");
                return;
            }

            // Optional: Validate email format
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                Alert.alert("Erro", "Por favor, insira um email válido.");
                return;
            }

            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const tutorRef = doc(firestore, 'Tutores', userId);

                // Update tutor details
                await updateDoc(tutorRef, {
                    Nome: tutorName,
                    Email: email,
                });

                // Update email in authentication if changed
                if (email !== user.email) {
                    await updateEmail(user, email);
                }

                // Update password if provided
                if (password) {
                    await updatePassword(user, password);
                }

                Alert.alert("Sucesso", "As informações do tutor foram atualizadas com sucesso!");
                navigation.goBack();
            }
        } catch (error) {
            console.error('Erro ao atualizar as informações do tutor:', error);
            Alert.alert("Erro", "Ocorreu um erro ao atualizar as informações do tutor: " + error.message);
        }
    };

    return (
        <Provider>
            <ImageBackground source={require('../assets/patas.png')} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.titleCont}>
                        <IconButton
                            icon="arrow-left"
                            onPress={handleGoBack}
                            size={24}
                            iconColor="#fff"
                            style={styles.backButton}
                        />
                        <Text style={styles.title}>Edite Suas Informações</Text>
                    </View>

                    <Text style={styles.dog}>Cachorro</Text>
                    <TextInput
                        label="Apelido"
                        value={nickname}
                        onChangeText={setNickname}
                        style={styles.input}
                    />
                    <View style={styles.row}>
                        <TextInput
                            label="Data de Nascimento"
                            value={birthDate}
                            onChangeText={setBirthDate}
                            style={[styles.input, styles.halfInput]}
                        />
                        <TextInput
                            label="Peso"
                            value={weight}
                            onChangeText={setWeight}
                            style={[styles.input, styles.halfInput, styles.peso]}
                        />
                    </View>
                    <View style={styles.pickerContainer}>
                        <Text style={styles.pickerLabel}>Porte</Text>
                        <Picker
                            selectedValue={size}
                            onValueChange={(itemValue) => setSize(itemValue)}
                            style={styles.picker}
                            mode="dialog"
                        >
                            <Picker.Item label="Pequeno" value="Pequeno" />
                            <Picker.Item label="Médio" value="Médio" />
                            <Picker.Item label="Grande" value="Grande" />
                        </Picker>
                    </View>
                    <Button mode="contained" style={styles.button} labelStyle={{ color: '#fff' }} onPress={handleUpdateDog}>
                        Atualizar Cachorro
                    </Button>
                    <Text style={styles.tutor}>Tutor</Text>
                    <TextInput
                        label="Nome Completo"
                        value={tutorName}
                        onChangeText={setTutorName}
                        style={styles.input}
                    />
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                    />
                    <TextInput
                        label="Senha (Deixe em branco para não alterar)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                    />

                    <View>
                        <Button mode="contained" style={[styles.button, styles.marginTop]} labelStyle={{ color: '#fff' }} onPress={handleUpdateTutor}>
                            Atualizar Tutor
                        </Button>
                    </View>
                </ScrollView>
            </ImageBackground>
        </Provider>
    );
}

const styles = StyleSheet.create({
    tutor: {
        fontSize: 26,
        color: '#FFF',
        marginBottom: 14,
        marginVertical: 45,
    },
    dog: {
        fontSize: 26,
        color: '#FFF',
        marginBottom: 14,
        marginVertical: 45,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
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
    peso: {
        width: '30%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '65%',
    },
    pickerContainer: {
        backgroundColor: '#FFF',
        marginBottom: 16,
        borderRadius: 4,
        borderBottomWidth: 1,
        borderColor: '#CCC',
        height: 70,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    picker: {
        width: '100%',
        height: 60,
    },
    pickerLabel: {
        marginLeft: 16,
        marginTop: 16,
        top: -5,
        position: 'absolute',
        fontSize: 12,
        color: '#49454F',
    },
    button: {
        marginTop: 16,
        backgroundColor: '#BE0C12',
        height: 40,
        paddingVertical: 0,
        paddingHorizontal: 10,
        alignSelf: 'center',
    },
    marginTop: {
        marginTop: 8,
    },
});
