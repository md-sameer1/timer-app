import React, { createContext, useReducer, useEffect, ReactNode } from "react";

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

      // Find any timer that just completed this tick (i.e. went from running to completed)
      const justCompleted = state.timers.find(
        (timer, i) => timer.status === "running" && timer.remaining === 1 // about to hit 0
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

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  // Global tick: dispatch a 'TICK' action every second
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
