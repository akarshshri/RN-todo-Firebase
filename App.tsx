import React, { useEffect, useState } from 'react';
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
import TaskEditModal from './components/TaskEditModal';

const App = () => {
  const [tasks, setTasks] = useState<any>([])
  const [input, setInput] = useState("")
  const [modalVisible, setModalVisible] = useState(false);
  const [taskIndex, setTaskIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);


  const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const dbname = "users"

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    let temp: object[] = []
    const querySnapshot = await getDocs(collection(db, dbname));
    querySnapshot.forEach((doc: any) => {
      if (doc.data().task !== ("" || null || undefined))
        temp.push({ task: doc.data().task, id: doc.id })
    });

    setTasks(temp)
    setIsLoading(false)
  }

  const handleSubmit = async () => {
    if (input !== '') {
      let tempID = Date.now().toString()
      setTasks([...tasks, { task: input, id: tempID}])
      setInput("")
      try {
        await setDoc(doc(db, dbname, tempID), {
          task: input,
          created_at: tempID,
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }

  const handleModalVisibility = (index: number) => {
    setTaskIndex(index)
    setModalVisible(!modalVisible)
  }

  const handleUpdatedTask = async (updatedTask: string, index: any) => {
    setModalVisible(!modalVisible)

    let obj = tasks.find((o: any) => o.id == index);
    const tempIndex = tasks.indexOf(obj);

    let tempArray = [...tasks]
    tempArray[tempIndex] = { task: updatedTask, id: index }
    setTasks(tempArray)

    await updateDoc(doc(db, dbname, index.toString()), {
      task: updatedTask,
    });

  }
  const handleDeleteTask = (index: any) => {
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
        onChangeText={(input) => {
          setInput(input);
        }}
        value={input}
      />
      <View style={styles.button}>
        <Button
          title="Submit"
          onPress={handleSubmit}
          color='white'
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

      { isLoading ? 
      <Text>Loading...</Text> : tasks.length !== 0 ? 
      <FlatList
        data={tasks}
        renderItem={(task) => {
          return (
            <View style={styles.tasksView}>
              <Text onPress={() => { handleModalVisibility(Number(task.item.id)) }} >{task.item.task}</Text>
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
  input: {
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
    backgroundColor: '#0193E0',
  },
  tasksView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16
  },
});

export default App;
