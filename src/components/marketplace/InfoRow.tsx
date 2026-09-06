import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme';
import { AppText, Icon, IconName } from '@/components/common';

interface Props {
  icon: IconName;
  title: string;
  subtitle?: string;
}

export function InfoRow({ icon, title, subtitle }: Props) {
  return (
    <View style={styles.row}>
      <Icon name={icon} size={18} color="brand" />
      <View style={styles.text}>
        <AppText variant="captionStrong" color="textPrimary">
          {title}
        </AppText>
        {subtitle ? <AppText variant="caption">{subtitle}</AppText> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  text: {
    flex: 1,
  },
});
