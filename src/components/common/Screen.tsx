import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors } from '@/theme';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Bottom edge is opted out of on screens with a sticky footer. */
  edges?: readonly Edge[];
  background?: 'default' | 'surface';
}

export function Screen({
  children,
  style,
  edges = ['top', 'left', 'right'],
  background = 'default',
}: Props) {
  return (
    <SafeAreaView
      edges={edges}
      style={[
        styles.safe,
        { backgroundColor: background === 'surface' ? colors.surface : colors.background },
      ]}
    >
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
