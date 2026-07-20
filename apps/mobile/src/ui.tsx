import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { dark, radius, spacing } from './theme';

/**
 * Shared dark-theme UI atoms for the driver app. These mirror the admin app's
 * premium navy surfaces with blue accents so both platforms feel like one
 * product. Presentational only — no business logic.
 */

/** A raised dark card surface. */
export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** Small rounded status/label pill. Tones map to the dark palette. */
export function Pill({
  label,
  tone = 'neutral',
  icon,
}: {
  label: string;
  tone?: 'neutral' | 'brand' | 'success' | 'warning';
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const toneStyle = {
    neutral: { bg: dark.overlay, fg: dark.textMuted },
    brand: { bg: dark.brandSoft, fg: dark.brandText },
    success: { bg: dark.successSoft, fg: dark.success },
    warning: { bg: 'rgba(245,158,11,0.16)', fg: dark.warning },
  }[tone];

  return (
    <View style={[styles.pill, { backgroundColor: toneStyle.bg }]}>
      {icon && <Ionicons name={icon} size={12} color={toneStyle.fg} />}
      <Text style={[styles.pillText, { color: toneStyle.fg }]}>{label}</Text>
    </View>
  );
}

/** A pulsing/solid status dot. */
export function Dot({ color = dark.success }: { color?: string }) {
  return <View style={[styles.dot, { backgroundColor: color }]} />;
}

/** Section heading with optional trailing element. */
export function SectionHeader({ title, trailing }: { title: string; trailing?: ReactNode }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {trailing}
    </View>
  );
}

/** Labeled metric used in stat rows. */
export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: dark.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: dark.border,
    padding: spacing.md,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: dark.text,
  },
  metric: {
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: dark.text,
  },
  metricLabel: {
    fontSize: 12,
    color: dark.textMuted,
    marginTop: 2,
  },
});
