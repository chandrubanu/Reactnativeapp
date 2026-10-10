import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { queryClient } from './src/api/queryClient';

/**
 * App.tsx is the composition root: every top-level Provider (React
 * Navigation's safe-area context, TanStack Query's cache provider) wraps
 * RootNavigator here, once. Angular comparison: similar to the providers
 * array in AppModule — except here it's expressed as nested JSX
 * component wrapping instead of a DI providers list.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <RootNavigator />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
