import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, Pill } from '../../src/ui';
import { LOAD_OFFERS, type LoadOffer } from '../../src/data';
import { dark, radius, spacing } from '../../src/theme';

/**
 * Load Offers — scrollable dispatcher-presented offers. Each card leads with
 * the lane and the money, shows the operational detail, an AI "Best Match"
 * badge where applicable, and Accept/Skip actions. Presentational only.
 */
export default function LoadsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.title}>Load Offers</Text>
          <Text style={styles.subtitle}>{LOAD_OFFERS.length} loads matched to your truck</Text>
        </View>
        <Pill label="Live" tone="success" icon="pulse" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {LOAD_OFFERS.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function OfferCard({ offer }: { offer: LoadOffer }) {
  return (
    <Card style={offer.bestMatch ? styles.bestCard : undefined}>
      {offer.bestMatch && (
        <View style={styles.bestBadge}>
          <Ionicons name="sparkles" size={12} color={dark.brandText} />
          <Text style={styles.bestBadgeText}>AI Best Match</Text>
        </View>
      )}

      {/* Lane + money */}
      <View style={styles.laneRow}>
        <View style={styles.laneLeft}>
          <Text style={styles.city}>{offer.origin}</Text>
          <Ionicons name="arrow-forward" size={16} color={dark.brandBright} />
          <Text style={styles.city}>{offer.destination}</Text>
        </View>
      </View>
      <View style={styles.moneyRow}>
        <Text style={styles.rate}>${offer.rate.toLocaleString()}</Text>
        <Text style={styles.rpm}>${offer.ratePerMile.toFixed(2)}/mi</Text>
      </View>

      {/* Detail grid */}
      <View style={styles.grid}>
        <Detail icon="speedometer" label="Miles" value={`${offer.miles}`} />
        <Detail icon="return-up-back" label="Deadhead" value={`${offer.deadhead} mi`} />
        <Detail icon="scale" label="Weight" value={`${(offer.weightLbs / 1000).toFixed(0)}k lbs`} />
        <Detail icon="cube" label="Equipment" value={offer.equipment} />
      </View>

      {/* Appointments */}
      <View style={styles.appts}>
        <View style={styles.appt}>
          <Text style={styles.apptLabel}>PICKUP</Text>
          <Text style={styles.apptValue}>{offer.pickup}</Text>
        </View>
        <View style={styles.appt}>
          <Text style={styles.apptLabel}>DELIVERY</Text>
          <Text style={styles.apptValue}>{offer.delivery}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="business" size={13} color={dark.textMuted} />
        <Text style={styles.metaText}>
          {offer.commodity} · {offer.broker}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
        <Pressable style={styles.acceptBtn}>
          <Ionicons name="checkmark" size={18} color={dark.text} />
          <Text style={styles.acceptText}>Accept load</Text>
        </Pressable>
      </View>
    </Card>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detail}>
      <Ionicons name={icon} size={15} color={dark.textMuted} />
      <View>
        <Text style={styles.detailValue}>{value}</Text>
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
    </View>
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
  bestCard: { borderColor: 'rgba(37,99,235,0.45)' },
  bestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: dark.brandSoft,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: spacing.sm,
  },
  bestBadgeText: { fontSize: 11, fontWeight: '800', color: dark.brandText, letterSpacing: 0.3 },
  laneRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  laneLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 1 },
  city: { fontSize: 16, fontWeight: '700', color: dark.text },
  moneyRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginTop: spacing.sm },
  rate: { fontSize: 28, fontWeight: '800', color: dark.text },
  rpm: { fontSize: 15, fontWeight: '700', color: dark.brandText },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: dark.border,
    paddingTop: spacing.md,
  },
  detail: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  detailValue: { fontSize: 14, fontWeight: '700', color: dark.text },
  detailLabel: { fontSize: 11, color: dark.textMuted },
  appts: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  appt: {
    flex: 1,
    backgroundColor: dark.overlay,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  apptLabel: { fontSize: 10, fontWeight: '700', color: dark.textMuted, letterSpacing: 0.5 },
  apptValue: { fontSize: 13, fontWeight: '600', color: dark.text, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm },
  metaText: { fontSize: 12, color: dark.textMuted },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  skipBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: dark.borderStrong,
  },
  skipText: { fontSize: 15, fontWeight: '700', color: dark.textMuted },
  acceptBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    backgroundColor: dark.brand,
  },
  acceptText: { fontSize: 15, fontWeight: '700', color: dark.text },
});
