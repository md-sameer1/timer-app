import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Timer } from "../store/TimerContext";
import TimerCard from "./TimerCard";

interface CategorySectionProps {
  category: string;
  timers: Timer[];
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onBulkStart: (category: string) => void;
  onBulkPause: (category: string) => void;
  onBulkReset: (category: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  timers,
  onStart,
  onPause,
  onReset,
  onBulkStart,
  onBulkPause,
  onBulkReset,
}) => {
  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.header}>
          {category} ({timers.length}) {expanded ? "-" : "+"}
        </Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.bulkActions}>
          <Button
            color={"purple"}
            title="Start All"
            onPress={() => onBulkStart(category)}
          />
          <Button
            color={"purple"}
            title="Pause All"
            onPress={() => onBulkPause(category)}
          />
          <Button
            color={"purple"}
            title="Reset All"
            onPress={() => onBulkReset(category)}
          />
        </View>
      )}
      {expanded &&
        timers.map((timer) => (
          <TimerCard
            key={timer.id}
            timer={timer}
            onStart={onStart}
            onPause={onPause}
            onReset={onReset}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#f2f2f2",
    padding: 8,
  },
  bulkActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 4,
  },
});

export default CategorySection;
