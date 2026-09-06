import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CheckoutProvider } from '@/store/CheckoutContext';
import { RootNavigator } from '@/navigation/RootNavigator';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

/**
 * App entry.
 *
 * In the real 1Fi app this tree already exists; the Marketplace mounts under the
 * existing Shop tab. Here it is reproduced at the smallest size that lets the
 * feature run standalone.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <CheckoutProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </CheckoutProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
