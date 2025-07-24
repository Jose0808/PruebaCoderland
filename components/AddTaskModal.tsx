import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (description: string) => void;
}

const AddTaskModal: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (!visible) {
            setDescription('');
        }
    }, [visible]);

    const handleSubmit = () => {
        const trimmedDescription = description.trim();

        if (trimmedDescription === '') {
            Alert.alert('Error', 'Task description cannot be empty');
            return;
        }

        onSubmit(trimmedDescription);
        setDescription('');
    };

    const handleCancel = () => {
        setDescription('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleCancel}
            testID="add-task-modal">
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoid}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add New Task</Text>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.label}>Task Description</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter task description..."
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={3}
                                maxLength={200}
                                testID="task-input"
                                autoFocus
                            />
                            <Text style={styles.characterCount}>
                                {description.length}/200 characters
                            </Text>
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={handleCancel}
                                testID="cancel-button">
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.submitButton]}
                                onPress={handleSubmit}
                                testID="submit-button">
                                <Text style={styles.submitButtonText}>Add Task</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyboardAvoid: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        width: '90%',
        maxWidth: 400,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalHeader: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    modalBody: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        textAlignVertical: 'top',
        minHeight: 80,
        backgroundColor: '#f9f9f9',
    },
    characterCount: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
        marginTop: 4,
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        marginLeft: 10,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});

export default AddTaskModal;