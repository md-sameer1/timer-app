// src/screens/AddTimerScreen.tsx
import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Timer, TimerContext } from "../store/TimerContext";

const AddTimerScreen: React.FC = () => {
  const { dispatch } = useContext(TimerContext);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [halfwayAlert, setHalfwayAlert] = useState(false);

  const handleAddTimer = () => {
    if (!name || !duration || !category) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    const durationNum = parseInt(duration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert("Error", "Duration must be a positive number.");
      return;
    }
    const newTimer: Timer = {
      id: Date.now().toString(),
      name,
      duration: durationNum,
      remaining: durationNum,
      category,
      status: "paused",
      halfwayAlert,
    };
    dispatch({ type: "ADD_TIMER", payload: newTimer });
    setName("");
    setDuration("");
    setCategory("");
    setHalfwayAlert(false);
    Alert.alert("Success", "Timer added successfully!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Timer Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Workout Timer"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Duration (in seconds)</Text>
      <TextInput
        style={styles.input}
        placeholder="60"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="Workout"
        value={category}
        onChangeText={setCategory}
      />
      <View style={styles.buttonContainer}>
        <Button color={"purple"} title="Add Timer" onPress={handleAddTimer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginVertical: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default AddTimerScreen;
