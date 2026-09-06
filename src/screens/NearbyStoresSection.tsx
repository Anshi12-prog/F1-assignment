import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { StateView } from '@/components/common';

/** Intentionally unimplemented per the assignment brief. */
export function NearbyStoresSection() {
  return (
    <View style={styles.container}>
      <StateView
        icon="store"
        title="Nearby Stores is on the way"
        message="Partner merchants around you, with in-store 1Fi checkout, will show up here."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.huge,
  },
});
