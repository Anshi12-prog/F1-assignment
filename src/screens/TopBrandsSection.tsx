import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { StateView } from '@/components/common';

/**
 * Intentionally unimplemented per the assignment brief. It renders the shared
 * empty state rather than a truly blank view so tab switching does not look
 * broken during a demo.
 */
export function TopBrandsSection() {
  return (
    <View style={styles.container}>
      <StateView
        icon="tag"
        title="Top Brands is on the way"
        message="Curated brand storefronts with no-cost EMI will show up here."
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
