import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';
import { Button } from './Button';
import { Icon, IconName } from './Icon';

interface Props {
  icon?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'neutral' | 'danger';
}

/**
 * Shared empty / error surface.
 *
 * Error copy is written for a customer, not a developer: it says what happened
 * and what to do next, and only offers a retry when retrying can actually help.
 */
export function StateView({
  icon = 'info',
  title,
  message,
  actionLabel,
  onAction,
  tone = 'neutral',
}: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, tone === 'danger' && styles.iconWrapDanger]}>
        <Icon name={icon} size={24} color={tone === 'danger' ? 'danger' : 'brand'} />
      </View>
      <AppText variant="subheading" align="center" style={styles.title}>
        {title}
      </AppText>
      {message ? (
        <AppText variant="caption" align="center" style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="secondary" size="md" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xl,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandSoft,
    marginBottom: spacing.lg,
  },
  iconWrapDanger: {
    backgroundColor: colors.dangerSoft,
  },
  title: {
    marginBottom: spacing.xs,
  },
  message: {
    marginBottom: spacing.lg,
    maxWidth: 320,
  },
});
