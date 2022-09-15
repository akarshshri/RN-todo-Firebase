import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  FlatList,
  processColor,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, setDoc, doc, updateDoc } from "firebase/firestore";
import 'dotenv/config';
import TaskEditModal from './components/TaskEditModal';

const App = () => {
  const [tasks , setTasks] = useState<any>([])
  const [input , setInput] = useState("")
  const [modalVisible, setModalVisible] = useState(false);
  const [taskIndex, setTaskIndex] = useState(0);

  
  const firebaseConfig = {
    apiKey:  process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  useEffect(() => {
    getData()
  }, [])
  
  const getData = async ()=>{
    let temp:string[] = []
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc:any) => {
        if(doc.data().task !== ("" || null || undefined))
          temp.push(doc.data().task)
       });  
    
      setTasks(temp) 
  }
  
  const handleSubmit = async ()=>{
    if(input !== ''){
      setTasks([...tasks, input])
      setInput("")
      try {
        await setDoc(doc(db, "users", Date.now().toString()), {
          task: input,
          created_at: Date.now(),
        });
      
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      
    }
  }

  const handleModalVisibility = (index:number) =>{
    setTaskIndex(index)
    setModalVisible(!modalVisible)
  }

  const handleUpdatedTask = async (updatedTask: string, index: any)=>{
    setModalVisible(!modalVisible)
    let temp = [...tasks]
    temp[index] = updatedTask
    setTasks(temp)

    await updateDoc(doc(db, "users", "1663265913244"), {
      task: updatedTask,
    });
    
  }
  const handleDeleteTask = (index: any)=>{
    setModalVisible(!modalVisible)
    let temp = [...tasks]
    temp.splice(index, 1);
    setTasks(temp)
  }

  return (
  <View style={styles.rootView} >
    <Text style={styles.topHeading} >  Enter a task </Text>
    <TextInput
        style={styles.input}
        placeholder={'Enter your task here'}
        onChangeText={(input)=>{
          setInput(input);
        }}
        value={input}
      />
      <View style={styles.button }>
        <Button
          title="Submit"
          onPress={handleSubmit}
          color={'white'}
          disabled={input.trim().length == 0}
        />
      </View>
      <TaskEditModal
        modalVisible={modalVisible}
        setModalVisible={handleModalVisibility}
        taskIndex={taskIndex}
        handleUpdatedTask={handleUpdatedTask}
        handleDeleteTask={handleDeleteTask}
      />

      {tasks.length !== 0 ? <FlatList
        data={tasks}
        renderItem={(task)=>{
          return (
            <View style={styles.tasksView}>
              <Text onPress={()=>{handleModalVisibility(Number(task.index))}} >{task.item}</Text>
              {/* <Text > Edit </Text> */}
            </View>
          )
        }}
      />
    :
    <Text style={styles.tasksView}>No Tasks available</Text>
    }
  </View>
  );
};

const styles = StyleSheet.create({
  
  rootView: {
    marginTop: 60,
  },
  topHeading: {
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8
  },
  input:{
    height: 48,
    margin: 16,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: '#B6B6B6'
  },
  button: {
    height: 48,
    margin: 16,
    padding: 4,
    borderRadius: 8,
    backgroundColor:'#0193E0',
  },
  tasksView:{
    flexDirection:'row',
    justifyContent: 'space-between',
    marginHorizontal: 16
  },
});

export default App;
