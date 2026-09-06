import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';

export interface SegmentedTabItem<T extends string> {
  id: T;
  label: string;
}

interface Props<T extends string> {
  items: ReadonlyArray<SegmentedTabItem<T>>;
  value: T;
  onChange: (id: T) => void;
  /** Scrollable when the labels will not fit on a narrow device. */
  scrollable?: boolean;
}

export function SegmentedTabs<T extends string>({
  items,
  value,
  onChange,
  scrollable = false,
}: Props<T>) {
  const content = items.map((item) => {
    const active = item.id === value;
    return (
      <Pressable
        key={item.id}
        onPress={() => onChange(item.id)}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        style={({ pressed }) => [
          styles.tab,
          scrollable ? styles.tabScrollable : styles.tabFlexible,
          active && styles.tabActive,
          pressed && styles.pressed,
        ]}
      >
        <AppText
          variant="captionStrong"
          numberOfLines={1}
          style={active ? styles.labelActive : styles.label}
        >
          {item.label}
        </AppText>
      </Pressable>
    );
  });

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {content}
      </ScrollView>
    );
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.sm,
  },
  tabFlexible: {
    flex: 1,
    paddingHorizontal: spacing.xs,
  },
  tabScrollable: {
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
  },
  tabActive: {
    backgroundColor: colors.brand,
  },
  label: {
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.textOnBrand,
  },
  pressed: {
    opacity: 0.75,
  },
});
