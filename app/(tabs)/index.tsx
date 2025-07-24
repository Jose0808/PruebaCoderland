import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Href, router } from 'expo-router';

const HomeScreen: React.FC = () => {
    const handleNavigateToTasks = () => {
        router.push('/(tabs)/TasksScreen'as Href);
    };
                  
    const handleNavigateToListing = () => {
        router.push('/(tabs)/ListScreen' as Href);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Task Manager</Text>
            <Text style={styles.subtitle}>Selecciona una opción</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={handleNavigateToTasks}
                testID="tasks-button"
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>Tasks</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={handleNavigateToListing}
                testID="listing-button"
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>List</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#36bed6ff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 10,
        width: '90%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
        // fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonDescription: {
        color: 'white',
        fontSize: 14,
        marginTop: 5,
        opacity: 0.8,
        textAlign: 'center',
    },
});

export default HomeScreen;