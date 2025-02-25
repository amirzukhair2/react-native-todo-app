import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc, Timestamp } from 'firebase/firestore'
import React, {useEffect, useState} from 'react'
import { View, FlatList, TouchableOpacity,ScrollView } from 'react-native'
import { FIREBASE_DB } from '../../firebaseConfig'
import { Button, TextInput, Text, IconButton, MD3Colors, Portal, Modal} from 'react-native-paper';

export interface Todo{
    title: string;
    done: boolean;
    id: string;
    createdAt: Timestamp;
}

export type Item = {
    title: string;
    done: boolean;
    id: string;
  };

function List({navigation}: any) {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [todo, setTodo] = useState('');


    const [visible, setVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const showModal = (item: any) => {
        setSelectedItem(item);
        setVisible(true);
    } 
    const hideModal = async () => {
        setVisible(false);

        if (selectedItem) {  
            const ref = doc(FIREBASE_DB, `todo/${selectedItem.id}`);  
            await updateDoc(ref, { title: selectedItem.title });  // 🔥 Updates Firestore
        }  

        setSelectedItem(null);
    } 

     const handleTitleChange = (text: string) => {
        if (selectedItem) {
            setSelectedItem({ ...selectedItem, title: text });
          }
     }

    const containerStyle = {backgroundColor: 'white', padding: 20, margin: 20, width: `100%` as '100%', maxWidth: 680, alignSelf: `center` as 'center'};


    useEffect(() => {
     const todoRef = collection(FIREBASE_DB, 'todo');

     const subscriber = onSnapshot(todoRef, {
        next: (snapshot) => {

            console.log('UPDATED')

            const todos: Todo[] = [];
            snapshot.docs.forEach(doc => {
                todos.push({
                    id: doc.id,
                    ...doc.data()
                } as Todo);
            })

            const sortedTodos = todos.sort((a,b) => {
                const dateA = a.createdAt.toDate();
                const dateB = b.createdAt.toDate();
                return dateB.getTime() - dateA.getTime(); // Sort by most recent
            })

            setTodos(sortedTodos);
        }
     });

     return () => subscriber();
    }, []);

    const addTodo = async () => {
       const doc = await addDoc(collection(FIREBASE_DB, 'todo'), {title: todo, done: false, createdAt: Timestamp.now()});
       setTodo('');
    }
    
    const renderTodo = ({item}: any) => {

      
        const ref = doc(FIREBASE_DB,`todo/${item.id}`);
        const toggleDone = () => {
            updateDoc(ref, {done: !item.done});
        }   

        const deleteItem = () => {
            deleteDoc(ref);
        }

        return(
            <View>
                <TouchableOpacity onPress={() => showModal(item)}>
                    <View className='flex flex-row items-center justify-between bg-white p-4 rounded px-2 mb-2'>
                        <View className='flex flex-row items-center'>
                        <IconButton onPress={toggleDone}
                         iconColor='green'
                         icon={item.done ? "checkbox-blank-circle" : "checkbox-blank-circle-outline"}
                         />
                        <Text variant="bodyLarge" className='px-2'>
                            {item.title}
                        </Text>
                        </View>
                        <IconButton onPress={deleteItem} icon="trash-can" mode="contained" />
                    </View>
                  
                </TouchableOpacity>
            </View>
           
        )
    }
    
  return (
    <View className='px-4' style={{flex: 1}}>
        <View className='py-4 flex items-center flex-row gap-5'>
            <TextInput label="新しいToDoを追加" style={{flex: 1}} onChangeText={(text: string) => setTodo(text)} value={todo} />
            <Button onPress={addTodo} icon="plus" mode="contained" disabled={todo === ''} >
                ToDoをついか
            </Button>
        </View>
        
        <View style={{flex: 1}}>
            {todos.length > 0 && (
                    <FlatList
                    data={todos}
                    renderItem={renderTodo}
                    keyExtractor={(todo: Todo) => todo.id}
                    />
            )}
        </View>

        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>

            {selectedItem && (
                <>
                <TextInput
                value={selectedItem.title}
                onChangeText={handleTitleChange}
                />
                <Button onPress={hideModal} mode="contained" style={{ marginTop: 10 }}>  
                ほぞんしてとじる  
                </Button>  
            </>
            )}

                
               
            </Modal>
        </Portal>
        
    </View>
  )
}

export default List
