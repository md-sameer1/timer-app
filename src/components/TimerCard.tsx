import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

import ProgressBar from "./ProgressBar";
import { Timer } from "../store/TimerContext";

interface TimerCardProps {
  timer: Timer;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
}

const TimerCard: React.FC<TimerCardProps> = ({
  timer,
  onStart,
  onPause,
  onReset,
}) => {
  const progress = ((timer.remaining as any) / (timer.duration ?? 1)) as any;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{timer.name}</Text>
      <Text>Status: {timer.status}</Text>
      <Text>
        Remaining: {timer.remaining} / {timer.duration} sec
      </Text>
      <ProgressBar progress={progress} />
      <View style={styles.buttonRow}>
        {timer.status !== "running" && timer.status !== "completed" && (
          <Button
            color={"purple"}
            title="Start"
            onPress={() => onStart(timer.id ?? "")}
          />
        )}
        {timer.status === "running" && (
          <Button
            color={"purple"}
            title="Pause"
            onPress={() => onPause(timer.id ?? "")}
          />
        )}
        <Button
          color={"purple"}
          title="Reset"
          onPress={() => onReset(timer.id ?? "")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
});

export default TimerCard;
