// src/screens/HistoryScreen.tsx
import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { TimerContext, CompletedTimer } from "../store/TimerContext";

const HistoryScreen: React.FC = () => {
  const { history } = useContext(TimerContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Timers History</Text>
      <FlatList
        data={history}
        keyExtractor={(item: CompletedTimer) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.timerName}>{item.name}</Text>
            <Text style={styles.completedAt}>
              {item.completedAt.toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>No completed timers yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  historyItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  timerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  completedAt: {
    fontSize: 14,
    color: "#555",
  },
});

export default HistoryScreen;
