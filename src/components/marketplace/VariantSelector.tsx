import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { AppText } from '@/components/common';
import { VariantOptionGroup } from '@/hooks';

interface Props {
  groups: VariantOptionGroup[];
  onSelect: (key: string, value: string) => void;
}

/**
 * Renders whatever attribute groups the product actually has - storage, colour,
 * memory, screen size - instead of assuming a fixed set. Options with no
 * in-stock variant behind them stay tappable but are visibly marked, so the user
 * learns why a combination is unavailable rather than finding a dead button.
 */
export function VariantSelector({ groups, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {groups.map((group) => (
        <View key={group.key} style={styles.group}>
          <AppText variant="captionStrong">{group.label}</AppText>
          <View style={styles.options}>
            {group.options.map((option) => {
              const isColour = Boolean(option.hex);
              return (
                <Pressable
                  key={option.value}
                  onPress={() => onSelect(group.key, option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: option.selected, disabled: !option.available }}
                  accessibilityLabel={`${group.label} ${option.value}${
                    option.available ? '' : ', out of stock'
                  }`}
                  style={({ pressed }) => [
                    styles.option,
                    option.selected && styles.optionSelected,
                    !option.available && styles.optionUnavailable,
                    pressed && styles.pressed,
                  ]}
                >
                  {isColour ? (
                    <View style={[styles.swatch, { backgroundColor: option.hex }]} />
                  ) : null}
                  <AppText
                    variant="captionStrong"
                    style={option.selected ? styles.labelSelected : styles.label}
                  >
                    {option.value}
                  </AppText>
                  {!option.available ? (
                    <AppText variant="caption" style={styles.soldOut}>
                      Sold out
                    </AppText>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
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
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.brandSurface,
  },
  optionUnavailable: {
    opacity: 0.55,
    borderStyle: 'dashed',
  },
  swatch: {
    width: 16,
    height: 16,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
  },
  label: {
    color: colors.textPrimary,
  },
  labelSelected: {
    color: colors.brandDark,
  },
  soldOut: {
    color: colors.textTertiary,
  },
  pressed: {
    opacity: 0.75,
  },
});
