import React, { useContext } from "react";
import { ScrollView, StyleSheet, Button, View } from "react-native";
import CategorySection from "../components/CategorySection";
import { TimerContext } from "../store/TimerContext";

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { timers, dispatch } = useContext(TimerContext);

  const categories = timers.reduce((acc: { [key: string]: any[] }, timer) => {
    if (!acc[timer.category as any]) {
      acc[timer.category as any] = [];
    }
    acc[timer.category as any].push(timer);
    return acc;
  }, {});

  const handleStart = (id: string) =>
    dispatch({ type: "START_TIMER", payload: { id } });
  const handlePause = (id: string) =>
    dispatch({ type: "PAUSE_TIMER", payload: { id } });
  const handleReset = (id: string) =>
    dispatch({ type: "RESET_TIMER", payload: { id } });
  const handleBulkStart = (category: string) =>
    dispatch({ type: "BULK_START", payload: { category } });
  const handleBulkPause = (category: string) =>
    dispatch({ type: "BULK_PAUSE", payload: { category } });
  const handleBulkReset = (category: string) =>
    dispatch({ type: "BULK_RESET", payload: { category } });

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginBottom: 10 }}>
        <Button
          color={"purple"}
          title="Add Timer"
          onPress={() => navigation.navigate("AddTimer")}
        />
      </View>
      <View>
        <Button
          color={"purple"}
          title="View History"
          onPress={() => navigation.navigate("History")}
        />
      </View>
      <View style={{ marginTop: 10, marginBottom: 20 }}>
        {Object.keys(categories).map((category) => (
          <CategorySection
            key={category}
            category={category}
            timers={categories[category]}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onBulkStart={handleBulkStart}
            onBulkPause={handleBulkPause}
            onBulkReset={handleBulkReset}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fafafa",
  },
});

export default HomeScreen;
