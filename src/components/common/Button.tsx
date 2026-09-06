import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  /** Small line under the label, used for "Includes GST" style context. */
  caption?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  caption,
  style,
  accessibilityHint,
}: Props) {
  const isInactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: isInactive, busy: loading }}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        isInactive && styles.inactive,
        pressed && !isInactive && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.textOnBrand : colors.brand} />
      ) : (
        <View style={styles.labelWrap}>
          <AppText
            variant="subheading"
            style={variant === 'primary' ? styles.primaryLabel : styles.secondaryLabel}
          >
            {label}
          </AppText>
          {caption ? (
            <AppText
              variant="caption"
              style={variant === 'primary' ? styles.primaryCaption : undefined}
            >
              {caption}
            </AppText>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 54,
  },
  primary: {
    backgroundColor: colors.brand,
  },
  secondary: {
    backgroundColor: colors.brandSurface,
    borderWidth: 1,
    borderColor: colors.brandSoft,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  inactive: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.995 }],
  },
  labelWrap: {
    alignItems: 'center',
  },
  primaryLabel: {
    color: colors.textOnBrand,
  },
  secondaryLabel: {
    color: colors.brandDark,
  },
  primaryCaption: {
    color: colors.brandSoft,
  },
});
