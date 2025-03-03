import React, { createContext, useReducer, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
export type TimerStatus = "running" | "paused" | "completed";

export interface Timer {
  id?: string;
  name?: string;
  duration?: number;
  remaining?: number;
  category?: string;
  status?: TimerStatus;
  halfwayAlert?: boolean;
}

export interface CompletedTimer {
  id: string;
  name: string;
  completedAt: Date;
}

interface TimerState {
  timers: Timer[];
  history?: CompletedTimer[];
  alertTimer: Timer | null;
}

type Action =
  | { type: "ADD_TIMER"; payload: Timer }
  | { type: "START_TIMER"; payload: { id: string } }
  | { type: "PAUSE_TIMER"; payload: { id: string } }
  | { type: "RESET_TIMER"; payload: { id: string } }
  | { type: "TICK" }
  | { type: "CLEAR_ALERT" }
  | { type: "BULK_START"; payload: { category: string } }
  | { type: "BULK_PAUSE"; payload: { category: string } }
  | { type: "BULK_RESET"; payload: { category: string } };

const initialState: TimerState = {
  timers: [],
  history: [],
  alertTimer: null,
};

function timerReducer(state: TimerState, action: Action): TimerState {
  switch (action.type) {
    case "ADD_TIMER":
      return { ...state, timers: [...state.timers, action.payload] };

    case "START_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload.id
            ? { ...timer, status: "running" }
            : timer
        ),
      };

    case "PAUSE_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload.id
            ? { ...timer, status: "paused" }
            : timer
        ),
      };

    case "RESET_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload.id
            ? { ...timer, remaining: timer.duration, status: "paused" }
            : timer
        ),
      };

    case "TICK": {
      const updatedTimers = state.timers.map((timer) => {
        if (timer.status === "running" && (timer.remaining as any) > 0) {
          const newRemaining = (timer.remaining as any) - 1;
          return {
            ...timer,
            remaining: newRemaining < 0 ? 0 : newRemaining,
            status:
              newRemaining <= 0 ? ("completed" as TimerStatus) : timer.status,
          };
        }
        return timer;
      });

      const justCompleted = state.timers.find(
        (timer, i) => timer.status === "running" && timer.remaining === 1
      );

      return {
        ...state,
        timers: updatedTimers,
        history:
          justCompleted && justCompleted.id && justCompleted.name
            ? [
                ...(state.history || []),
                {
                  id: justCompleted.id,
                  name: justCompleted.name,
                  completedAt: new Date(),
                },
              ]
            : state.history,
        alertTimer:
          state.alertTimer === null ? justCompleted || null : state.alertTimer,
      };
    }

    case "CLEAR_ALERT":
      return { ...state, alertTimer: null };

    case "BULK_START":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.category === action.payload.category
            ? { ...timer, status: "running" }
            : timer
        ),
      };

    case "BULK_PAUSE":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.category === action.payload.category
            ? { ...timer, status: "paused" }
            : timer
        ),
      };

    case "BULK_RESET":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.category === action.payload.category
            ? { ...timer, remaining: timer.duration, status: "paused" }
            : timer
        ),
      };

    default:
      return state;
  }
}

interface TimerContextProps extends TimerState {
  dispatch: React.Dispatch<Action>;
}

export const TimerContext = createContext<TimerContextProps>({
  ...initialState,
  dispatch: () => null,
});

const STORAGE_KEYS = {
  TIMERS: "@MyTimer:timers",
  HISTORY: "@MyTimer:history",
};

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const [storedTimers, storedHistory] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.TIMERS),
          AsyncStorage.getItem(STORAGE_KEYS.HISTORY),
        ]);

        if (storedTimers) {
          const timers = JSON.parse(storedTimers);
          timers.forEach((timer: Timer) => {
            dispatch({ type: "ADD_TIMER", payload: timer });
          });
        }

        if (storedHistory) {
          const history = JSON.parse(storedHistory);
          initialState.history = history;
        }
      } catch (error) {
        console.error("Error loading data from AsyncStorage:", error);
      }
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await Promise.all([
          AsyncStorage.setItem(
            STORAGE_KEYS.TIMERS,
            JSON.stringify(state.timers)
          ),
          AsyncStorage.setItem(
            STORAGE_KEYS.HISTORY,
            JSON.stringify(state.history)
          ),
        ]);
      } catch (error) {
        console.error("Error saving data to AsyncStorage:", error);
      }
    };

    saveData();
  }, [state.timers, state.history]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TimerContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
};
