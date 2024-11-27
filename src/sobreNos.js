import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function SobreNos() {
    const navigation = useNavigation();

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <ImageBackground source={require('../assets/about.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <IconButton
                        icon="arrow-left"
                        onPress={handleGoBack}
                        size={24}
                        iconColor="#232323"
                        style={styles.backButton}
                    />
                    <Text style={styles.title}>Conheça quem somos</Text>
                    <ScrollView style={styles.descriptionContainer}>
                        <Text style={styles.description}>
                            CanisHerz é um sistema inovador voltado para o acompanhamento cardíaco do seu cachorro. 
                            Nossa plataforma foi desenvolvida para fornecer um método preciso e eficiente de avaliação da saúde cardíaca do seu cachorro, 
                            garantindo que você tenha sempre o melhor controle possível.

                            O sistema utiliza tecnologias avançadas para monitorar sinais vitais e detectar anomalias, 
                            alertando os tutores e veterinários. 
                            Além disso, o CanisHerz oferece um painel intuitivo onde você pode acompanhar o histórico 
                            realizar testes periódicos.

                            O objetivo principal do CanisHerz é oferecer uma vida mais longa e saudável para os nossos amigos de quatro patas. 
                            Com ele, você pode se sentir tranquilo sabendo que está fazendo o melhor pelo seu animal de estimação.
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backButton: {
        backgroundColor: '#FFF8F7',
        marginBottom: 20,
        display: 'flex',
        justifyContent: 'flex-start',
    },
    textContainer: {
        width: '100%',
        height: '50%',
        backgroundColor: '#FFF8F7',
        padding: 20,
        borderTopEndRadius: 32,
        borderTopStartRadius: 32,
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#232323',
        marginBottom: 20,
    },
    descriptionContainer: {
        flex: 1, // Garante que o ScrollView ocupe o espaço restante disponível
    },
    description: {
        fontSize: 20, // Tamanho da fonte ajustado para facilitar a leitura
        color: '#232323',
        lineHeight: 30, // Aumenta a altura da linha para melhorar a legibilidade
        paddingBottom: 20, // Adiciona um pouco de espaço no final para evitar corte abrupto
    },
});
