// src/components/ProgressBar.tsx
import React from "react";
import { View, StyleSheet } from "react-native";

interface ProgressBarProps {
  progress: number; // Value between 0 and 1
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.filler, { flex: progress }]} />
      <View style={[styles.remaining, { flex: 1 - progress }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 10,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 8,
  },
  filler: {
    backgroundColor: "#76c7c0",
  },
  remaining: {
    backgroundColor: "#e0e0e0",
  },
});

export default ProgressBar;
