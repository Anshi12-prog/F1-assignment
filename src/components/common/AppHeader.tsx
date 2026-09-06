import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  /** Removes the hairline for screens that scroll content right under it. */
  transparent?: boolean;
}

export function AppHeader({ title, subtitle, onBack, right, transparent = false }: Props) {
  return (
    <View style={[styles.header, transparent && styles.transparent]}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <Icon name="chevron-left" size={22} />
        </Pressable>
      ) : (
        <View style={styles.backSpacer} />
      )}

      <View style={styles.titleWrap}>
        <AppText variant="subheading" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  transparent: {
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
  },
  back: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  backSpacer: {
    width: spacing.xs,
  },
  pressed: {
    opacity: 0.6,
  },
  titleWrap: {
    flex: 1,
  },
  right: {
    minWidth: 32,
    alignItems: 'flex-end',
  },
});
