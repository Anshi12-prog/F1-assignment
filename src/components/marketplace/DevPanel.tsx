import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { AppText, Icon } from '@/components/common';
import { invalidateCache, mockConfig } from '@/api';

/**
 * Dev-only affordance for exercising the states that are otherwise hard to reach
 * in a demo build: slow network and hard failure. Not compiled into release
 * builds - the whole component is gated on __DEV__ by its caller.
 */
export function DevPanel({ onChange }: { onChange: () => void }) {
  const [open, setOpen] = useState(false);
  const [, force] = useState(0);

  const apply = (mutate: () => void) => {
    mutate();
    invalidateCache();
    force((value) => value + 1);
    onChange();
  };

  if (!open) {
    return (
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={10}
        accessibilityLabel="Open developer controls"
        style={styles.trigger}
      >
        <Icon name="sliders" size={16} color="textTertiary" />
      </Pressable>
    );
  }

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <AppText variant="captionStrong">Mock API controls</AppText>
        <Pressable onPress={() => setOpen(false)} hitSlop={10} accessibilityLabel="Close">
          <Icon name="close" size={14} color="textTertiary" />
        </Pressable>
      </View>

      <View style={styles.row}>
        <Toggle
          label="Force error"
          active={mockConfig.failureRate === 1}
          onPress={() => apply(() => {
            mockConfig.failureRate = mockConfig.failureRate === 1 ? 0 : 1;
          })}
        />
        <Toggle
          label="Slow network"
          active={mockConfig.maxLatencyMs > 2000}
          onPress={() => apply(() => {
            const slow = mockConfig.maxLatencyMs > 2000;
            mockConfig.minLatencyMs = slow ? 320 : 1800;
            mockConfig.maxLatencyMs = slow ? 900 : 3200;
          })}
        />
      </View>
    </View>
  );
}

function Toggle({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.toggle, active && styles.toggleActive]}
      accessibilityRole="switch"
      accessibilityState={{ checked: active }}
    >
      <AppText variant="caption" style={active ? styles.toggleLabelActive : undefined}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  trigger: {
    padding: spacing.xs,
  },
  panel: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 20,
    width: 240,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  toggle: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  toggleActive: {
    backgroundColor: colors.brand,
  },
  toggleLabelActive: {
    color: colors.textOnBrand,
  },
});
