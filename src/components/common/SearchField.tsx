import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';
import { Icon } from './Icon';

interface Props {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}

export function SearchField({ value, onChangeText, placeholder = 'Search products' }: Props) {
  return (
    <View style={styles.container}>
      <Icon name="search" size={18} color="textTertiary" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel="Search the 1Fi Marketplace"
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Icon name="close" size={16} color="textTertiary" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 46,
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
  },
});
