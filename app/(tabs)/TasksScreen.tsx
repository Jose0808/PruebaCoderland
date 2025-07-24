import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addTask, removeTask, toggleTask, Task } from '../store/tasksSlice';
import AddTaskModal from '../../components/AddTaskModal';
import { Ionicons } from '@expo/vector-icons';

const TasksScreen: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const dispatch = useDispatch();

    // Abrir modal
    const openModal = () => {
        setModalVisible(true);
    };

    // Cerrar modal
    const closeModal = () => {
        setModalVisible(false);
    };

    // Agregar nueva tarea
    const handleAddTask = (description: string) => {
        if (description.trim().length === 0) {
            Alert.alert('Error', 'Task description cannot be empty');
            return;
        }
        
        dispatch(addTask(description.trim()));
        closeModal();
        Alert.alert('Success', 'Task added successfully!');
    };

    // Eliminar tarea
    const handleDeleteTask = (taskId: string) => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => dispatch(removeTask(taskId)),
                },
            ],
        );
    };

    // Alternar estado completado
    const handleToggleTask = (taskId: string) => {
        dispatch(toggleTask(taskId));
    };

    const renderTask = ({ item }: { item: Task }) => (
        <View style={styles.taskItem} testID={`task-${item.id}`}>
            <TouchableOpacity
                style={styles.taskContent}
                onPress={() => handleToggleTask(item.id)}
                activeOpacity={0.7}
            >
                <View style={styles.taskInfo}>
                    <Ionicons
                        name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                        size={24}
                        color={item.completed ? '#4CAF50' : '#ccc'}
                        style={styles.checkIcon}
                    />
                    <View style={styles.taskTextContainer}>
                        <Text
                            style={[
                                styles.taskDescription,
                                item.completed && styles.completedTask,
                            ]}
                        >
                            {item.description}
                        </Text>
                        <Text style={styles.taskDate}>
                            {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
            
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTask(item.id)}
                testID={`delete-task-${item.id}`}
                activeOpacity={0.7}
            >
                <Ionicons name="trash-outline" size={18} color="white" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>My Tasks</Text>
                    <Text style={styles.taskCount}>
                        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                        {tasks.filter(task => task.completed).length > 0 && 
                            ` • ${tasks.filter(task => task.completed).length} completed`
                        }
                    </Text>
                </View>
                
                {/* Botón principal para agregar tarea */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={openModal}
                    testID="add-task-button"
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={20} color="white" style={styles.addIcon} />
                    <Text style={styles.addButtonText}>Add Task</Text>
                </TouchableOpacity>
            </View>

            {/* Lista de tareas o estado vacío */}
            {tasks.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="clipboard-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyText}>No tasks yet!</Text>
                    <Text style={styles.emptySubtext}>
                        Tap "Add Task" to create your first task
                    </Text>
                    <TouchableOpacity
                        style={styles.emptyButton}
                        onPress={openModal}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.emptyButtonText}>Create First Task</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={tasks}
                    renderItem={renderTask}
                    keyExtractor={item => item.id}
                    style={styles.list}
                    testID="tasks-list"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            )}

            {/* Botón flotante (solo si hay tareas) */}
            {tasks.length > 0 && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={openModal}
                    activeOpacity={0.8}
                    testID="add-task-fab"
                >
                    <Ionicons name="add" size={28} color="white" />
                </TouchableOpacity>
            )}

            {/* Modal para agregar tarea */}
            <AddTaskModal
                visible={modalVisible}
                onClose={closeModal}
                onSubmit={handleAddTask}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    taskCount: {
        fontSize: 14,
        color: '#666',
    },
    addButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
    },
    addIcon: {
        marginRight: 6,
    },
    addButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    list: {
        flex: 1,
    },
    listContent: {
        padding: 20,
        paddingBottom: 100, // Espacio para el FAB
    },
    taskItem: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    taskContent: {
        flex: 1,
        padding: 16,
    },
    taskInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkIcon: {
        marginRight: 12,
    },
    taskTextContainer: {
        flex: 1,
    },
    taskDescription: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
        lineHeight: 22,
    },
    completedTask: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    taskDate: {
        fontSize: 12,
        color: '#666',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#666',
        marginTop: 20,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },
    emptyButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    emptyButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
});

export default TasksScreen;