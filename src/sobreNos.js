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
        <ImageBackground source={require('../assets/sobre.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <IconButton
                    icon="arrow-left"
                    onPress={handleGoBack}
                    iconColor="#FFF"
                    style={styles.backButton}
                />

                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Conheça quem somos</Text>
                        <Text style={styles.description}>
                            Mussum Ipsum, cacilds vidis litro abertis. Morbi viverra placerat justo, vel pharetra turpis.
                            Tá deprimidis, eu conheço uma cachacis que pode alegrar sua vidis. Em pé sem cair, deitado sem dormir,
                            sentado sem cochilar e fazendo pose. Delegadis gente finis, bibendum egestas augue arcu ut est.
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
        paddingHorizontal: 24,
        paddingVertical: 48,
    },
    backButton: {
        position: 'absolute',
        marginVertical: 50,
        marginHorizontal: 24,
        top: 10,
        left: 10,
    },
    textContainer: {
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Fundo semi-transparente para o texto
        padding: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: '#FFF',
        lineHeight: 24,
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
