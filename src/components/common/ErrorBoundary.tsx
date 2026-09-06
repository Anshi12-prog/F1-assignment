import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { StateView } from './StateView';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Last line of defence.
 *
 * A render crash inside the Marketplace should not take the whole app down with
 * a white screen; the boundary catches it, reports it, and offers a way back.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Replace with the app's crash reporter (Sentry / Firebase) in production.
    console.error('[Marketplace] render error', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View style={styles.container}>
        <StateView
          icon="alert"
          tone="danger"
          title="Something went wrong"
          message="The screen could not be displayed. Please try again."
          actionLabel="Reload"
          onAction={() => this.setState({ hasError: false })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
});
