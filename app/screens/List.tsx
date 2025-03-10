import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc, Timestamp } from 'firebase/firestore'
import React, {useEffect, useState} from 'react'
import { View, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { FIREBASE_DB } from '../../firebaseConfig'
import { Button, TextInput, Text, IconButton, MD3Colors, Portal, Modal} from 'react-native-paper';
import MyCalendar from '../../app/screens/calendar';

import { supabase } from '../../lib/supabase';


export interface Todo{
    title: string;
    done: boolean;
    id: string;
    createdAt: Timestamp;
    start: Date,
    end: Date
}

export type Item = {
    title: string;
    done: boolean;
    id: string;
    start: Date,
    end: Date
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
     

    const addNewTodo = async (title: string,start: Date, end: Date) => {
        const { data, error } = await supabase
            .from('todo') // your table name
            .insert([
                {
                title,
                // done: false,
                start,
                end
                }
            ])
            if (error) {
                console.error('Error inserting todo:', error);
            } else {
                console.log('Todo added:', data);
            }
    }

    useEffect(() => {


     async function fetchTodos() {
        const { data, error } = await supabase
          .from('todo')
          .select('*');  // Select all columns from the "todo" table
        
        if (error) {
          console.error('Error fetching todos:', error);
          return;
        }
        const sortedTodos = data?.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime(); // Sort by most recent
          });
        console.log('Todos:', data);
        setTodos(sortedTodos); // Update the todos state
      }
      
      fetchTodos();
      return () =>{
        
      };
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
       
       <ScrollView>

     
        <View className='py-4 flex items-center flex-row gap-5'>
            <TextInput label="新しいToDoを追加" style={{flex: 1}} onChangeText={(text: string) => setTodo(text)} value={todo} />
            <Button onPress={addTodo} icon="plus" mode="contained" disabled={todo === ''} >
                ToDoをついか
            </Button>
        </View>

        <MyCalendar onPress={showModal} items={todos} addNewTodo={addNewTodo}/>
{/*         
        <View style={{flex: 1}}>
            {todos.length > 0 && (
                    <FlatList
                    data={todos}
                    renderItem={renderTodo}
                    keyExtractor={(todo: Todo) => todo.id}
                    />
            )}
        </View> */}

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
        </ScrollView>
    </View>
  )
}

export default List
