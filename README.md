# Timer App

A React Native mobile application for managing multiple timers with categories and tracking completed timers.

## Features

- Create multiple timers with custom names and durations
- Organize timers by categories
- Control individual timers (start, pause, reset)
- Bulk actions for timers in the same category
- Track completed timer history
- Visual progress bars for timer status
- Completion alerts

## Tech Stack

- React Native with Expo
- TypeScript
- React Navigation
- React Context API for state management

## Getting Started

1. Install dependencies:

```sh
npm install
```

2. Start the development server:

```sh
npm start
```

3.  Run on your device:

- For iOS: npm run ios
- For Android: npm run android
- For web: npm run web

App Structure

- components: Reusable UI components
- screens: Main application screens
- store: Global state management with TimerContext

Navigation

- Home: View and manage all timers organized by categories
- Add Timer: Create new timers with custom settings
- History: View completed timer history
