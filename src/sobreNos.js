import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function SobreNos() {
    const navigation = useNavigation();

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <ImageBackground source={require('../assets/caoBack.png')} style={styles.backgroundImage}>
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
                    <Text style={styles.description}>
                        CanisHerz é um sistema voltado para ao acompanhamento cadíaco do seu cachorro, permitindo um método melhor de avaliação sobre a saúde seu querido pet.
                    </Text>
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
        height: '60%',
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
    description: {
        fontSize: 24,
        color: '#232323',
        lineHeight: 36,
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
