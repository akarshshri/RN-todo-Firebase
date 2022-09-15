import { View, Text, Modal, Pressable, StyleSheet, Alert, TextInput } from 'react-native'
import React, { useState } from 'react'

export default function TaskEditModal(props: any) {
    const [updatedTask, setUpdatedTask] = useState("")

    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={props.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            props.setModalVisible
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text>Edit Task</Text>
            <TextInput
                style={styles.input}
                placeholder="Update task"
                onChangeText={setUpdatedTask}
                value={updatedTask}
            />
              <View style={{flexDirection: 'row'}}>
              <Pressable
                style={[styles.button, styles.buttonUpdate]}
                onPress={() => {props.handleUpdatedTask(updatedTask , props.taskIndex); setUpdatedTask("")}}
              >
                <Text style={styles.textStyle}>Update</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {props.handleDeleteTask(props.taskIndex); setUpdatedTask("")}}
              >
                <Text style={styles.textStyle}>Delete</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {props.setModalVisible(); setUpdatedTask("")}}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '80%'
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonUpdate: {
      backgroundColor: "#2196F3",
    },
    buttonCancel: {
      backgroundColor: "red",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      width: '100%',
      borderRadius: 8
    },
  });
  