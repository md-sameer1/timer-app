// App.tsx
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import AddTimerScreen from "./src/screens/AddTimerScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import { TimerProvider, TimerContext } from "./src/store/TimerContext";
import ModalAlert from "./src/components/ModalAlert";

export type RootStackParamList = {
  Home: undefined;
  AddTimer: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContent = () => {
  const { alertTimer, dispatch } = useContext(TimerContext);
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddTimer" component={AddTimerScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      {alertTimer && (
        <ModalAlert
          visible={true}
          timerName={alertTimer.name as any}
          onClose={() => dispatch({ type: "CLEAR_ALERT" })}
        />
      )}
    </>
  );
};

export default function App() {
  return (
    <TimerProvider>
      <AppContent />
    </TimerProvider>
  );
}
