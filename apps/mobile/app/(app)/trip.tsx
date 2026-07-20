import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, Metric, Pill } from '../../src/ui';
import { CURRENT_TRIP, type TripStep } from '../../src/data';
import { dark, radius, spacing } from '../../src/theme';

/**
 * Current Load — the active trip. Shows a shipment status timeline
 * (Pickup → In Transit → Delivered), ETA, load details, and quick action
 * buttons (Documents, Navigation, Call Dispatcher, Load Details).
 */
export default function TripScreen() {
  const trip = CURRENT_TRIP;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.title}>Current Load</Text>
          <Text style={styles.subtitle}>Load {trip.id}</Text>
        </View>
        <Pill label="In Transit" tone="success" icon="pulse" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Lane + ETA hero */}
        <Card style={styles.hero}>
          <View style={styles.laneRow}>
            <Text style={styles.city}>{trip.origin}</Text>
            <Ionicons name="arrow-forward" size={18} color={dark.brandBright} />
            <Text style={styles.city}>{trip.destination}</Text>
          </View>
          <View style={styles.etaBox}>
            <Ionicons name="time" size={18} color={dark.brandText} />
            <View>
              <Text style={styles.etaLabel}>Estimated arrival</Text>
              <Text style={styles.etaValue}>{trip.eta}</Text>
            </View>
          </View>
        </Card>

        {/* Status timeline */}
        <Card>
          <Text style={styles.cardTitle}>Shipment status</Text>
          <View style={styles.timeline}>
            {trip.steps.map((step, index) => (
              <TimelineRow key={step.key} step={step} last={index === trip.steps.length - 1} />
            ))}
          </View>
        </Card>

        {/* Load details */}
        <Card>
          <Text style={styles.cardTitle}>Load details</Text>
          <View style={styles.metrics}>
            <Metric label="Rate" value={`$${trip.rate.toLocaleString()}`} />
            <Metric label="Miles" value={`${trip.miles}`} />
            <Metric label="Equipment" value={trip.equipment} />
          </View>
          <View style={[styles.metrics, { marginTop: spacing.md }]}>
            <Metric label="Commodity" value={trip.commodity} />
            <Metric label="Weight" value={`${(trip.weightLbs / 1000).toFixed(0)}k lbs`} />
            <Metric label="Dispatcher" value={trip.dispatcher.name} />
          </View>
        </Card>

        {/* Quick actions */}
        <View style={styles.actionsGrid}>
          <ActionButton icon="document-text" label="Documents" />
          <ActionButton icon="navigate" label="Navigation" primary />
          <ActionButton icon="call" label="Call Dispatcher" />
          <ActionButton icon="information-circle" label="Load Details" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TimelineRow({ step, last }: { step: TripStep; last: boolean }) {
  const done = step.state === 'done';
  const active = step.state === 'active';

  return (
    <View style={styles.tlRow}>
      <View style={styles.tlMarkerCol}>
        <View
          style={[
            styles.tlDot,
            done && styles.tlDotDone,
            active && styles.tlDotActive,
          ]}
        >
          {done && <Ionicons name="checkmark" size={12} color={dark.text} />}
          {active && <View style={styles.tlDotInner} />}
        </View>
        {!last && <View style={[styles.tlLine, done && styles.tlLineDone]} />}
      </View>
      <View style={styles.tlBody}>
        <Text style={[styles.tlLabel, step.state === 'pending' && styles.tlLabelPending]}>
          {step.label}
        </Text>
        <Text style={styles.tlDetail}>{step.detail}</Text>
      </View>
    </View>
  );
}

function ActionButton({
  icon,
  label,
  primary = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  primary?: boolean;
}) {
  return (
    <Pressable style={[styles.action, primary && styles.actionPrimary]}>
      <Ionicons name={icon} size={22} color={primary ? dark.text : dark.brandBright} />
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: dark.bg },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: { fontSize: 22, fontWeight: '800', color: dark.text },
  subtitle: { fontSize: 13, color: dark.textMuted, marginTop: 2 },
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  hero: { borderColor: 'rgba(37,99,235,0.4)', backgroundColor: dark.surfaceRaised },
  laneRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  city: { fontSize: 18, fontWeight: '800', color: dark.text },
  etaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    backgroundColor: dark.brandSoft,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  etaLabel: { fontSize: 11, color: dark.brandText },
  etaValue: { fontSize: 16, fontWeight: '700', color: dark.text },
  cardTitle: { fontSize: 16, fontWeight: '700', color: dark.text, marginBottom: spacing.md },
  timeline: { gap: 0 },
  tlRow: { flexDirection: 'row', gap: spacing.md },
  tlMarkerCol: { alignItems: 'center', width: 24 },
  tlDot: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: dark.overlay,
    borderWidth: 1,
    borderColor: dark.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tlDotDone: { backgroundColor: dark.success, borderColor: dark.success },
  tlDotActive: { borderColor: dark.brandBright, backgroundColor: dark.brandSoft },
  tlDotInner: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: dark.brandBright,
  },
  tlLine: { width: 2, flex: 1, minHeight: 28, backgroundColor: dark.border, marginVertical: 2 },
  tlLineDone: { backgroundColor: dark.success },
  tlBody: { flex: 1, paddingBottom: spacing.lg },
  tlLabel: { fontSize: 15, fontWeight: '700', color: dark.text },
  tlLabelPending: { color: dark.textMuted },
  tlDetail: { fontSize: 13, color: dark.textMuted, marginTop: 2 },
  metrics: { flexDirection: 'row', gap: spacing.sm },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  action: {
    width: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: dark.surface,
    borderWidth: 1,
    borderColor: dark.border,
  },
  actionPrimary: { backgroundColor: dark.brand, borderColor: dark.brand },
  actionLabel: { fontSize: 14, fontWeight: '700', color: dark.text },
});
