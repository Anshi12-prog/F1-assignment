import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { AppText, Badge, Icon } from '@/components/common';
import { EmiPlan } from '@/types/marketplace';
import { formatCurrency } from '@/utils/currency';
import { planTagLabel } from '@/utils/emi';

interface Props {
  plan: EmiPlan;
  selected: boolean;
  onSelect: (plan: EmiPlan) => void;
}

function EmiPlanCardComponent({ plan, selected, onSelect }: Props) {
  const tag = planTagLabel(plan.tag);
  const disabled = !plan.eligible;

  return (
    <Pressable
      onPress={() => onSelect(plan)}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={`${plan.tenureMonths} month plan, ${formatCurrency(
        plan.monthlyEmi,
      )} per month`}
      style={({ pressed }) => [
        styles.card,
        selected && styles.selected,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={styles.radioColumn}>
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected ? <Icon name="check" size={12} color="textOnBrand" strokeWidth={3} /> : null}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <AppText variant="subheading">
            {formatCurrency(plan.monthlyEmi)}
            <AppText variant="caption">{`  \u00D7 ${plan.tenureMonths} months`}</AppText>
          </AppText>
          {tag ? <Badge label={tag} tone={plan.tag === 'RECOMMENDED' ? 'brand' : 'neutral'} /> : null}
        </View>

        <View style={styles.metaRow}>
          {plan.isNoCost ? (
            <Badge label="No-cost EMI · 0% interest" tone="success" />
          ) : (
            <AppText variant="caption">
              {plan.interestRate}% p.a. · {formatCurrency(plan.interestComponent)} interest
            </AppText>
          )}
        </View>

        <AppText variant="caption">
          Total payable {formatCurrency(plan.totalPayable)} · lien{' '}
          {formatCurrency(plan.pledgeAmount)}
        </AppText>

        {disabled && plan.ineligibleReason ? (
          <View style={styles.warning}>
            <Icon name="alert" size={13} color="warning" />
            <AppText variant="caption" style={styles.warningText}>
              {plan.ineligibleReason}
            </AppText>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

export const EmiPlanCard = memo(EmiPlanCardComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selected: {
    borderColor: colors.brand,
    backgroundColor: colors.brandSurface,
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: colors.surfaceMuted,
  },
  pressed: {
    opacity: 0.9,
  },
  radioColumn: {
    paddingTop: spacing.xxs,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.brand,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  warningText: {
    flex: 1,
    color: colors.warning,
  },
});
