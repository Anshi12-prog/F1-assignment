import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { AppText, Divider } from '@/components/common';
import { SpecificationGroup } from '@/types/marketplace';

export function SpecificationList({ groups }: { groups: SpecificationGroup[] }) {
  return (
    <View style={styles.container}>
      {groups.map((group, groupIndex) => (
        <View key={group.title} style={styles.group}>
          <AppText variant="captionStrong">{group.title}</AppText>
          {group.items.map((item) => (
            <View key={item.label} style={styles.row}>
              <AppText variant="caption" style={styles.label}>
                {item.label}
              </AppText>
              <AppText variant="body" style={styles.value}>
                {item.value}
              </AppText>
            </View>
          ))}
          {groupIndex < groups.length - 1 ? <Divider /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  group: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  label: {
    width: 110,
  },
  value: {
    flex: 1,
  },
});
