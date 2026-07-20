import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, Pill } from '../../src/ui';
import { DRIVER, PROFILE_DOCS, type ProfileDoc } from '../../src/data';
import { dark, radius, spacing } from '../../src/theme';

/**
 * Profile — driver identity, truck information, document management,
 * availability schedule, load preferences, and payment. Presentational only.
 */
export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Identity */}
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {DRIVER.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </Text>
          </View>
          <Text style={styles.name}>{DRIVER.name}</Text>
          <View style={styles.identityMeta}>
            <Pill label={DRIVER.role} tone="brand" />
            <View style={styles.rating}>
              <Ionicons name="star" size={13} color={dark.warning} />
              <Text style={styles.ratingText}>{DRIVER.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        {/* Truck information */}
        <Section title="Truck information" icon="bus">
          <InfoRow label="Unit" value={DRIVER.truck.unit} />
          <InfoRow label="Type" value={DRIVER.truck.type} />
          <InfoRow label="Equipment" value={DRIVER.truck.equipment} />
          <InfoRow label="Plate" value={DRIVER.truck.plate} last />
        </Section>

        {/* Document management */}
        <Section title="Documents" icon="document-text">
          {PROFILE_DOCS.map((doc, index) => (
            <DocRow key={doc.key} doc={doc} last={index === PROFILE_DOCS.length - 1} />
          ))}
        </Section>

        {/* Availability schedule */}
        <Section title="Availability schedule" icon="calendar">
          <InfoRow label="Status" value="Available now" />
          <InfoRow label="Home time" value="Fri 6:00 PM – Sun 8:00 PM" />
          <InfoRow label="Home base" value={DRIVER.preferences.homeBase} last />
        </Section>

        {/* Load preferences */}
        <Section title="Load preferences" icon="options">
          <InfoRow label="Preferred lanes" value={DRIVER.preferences.lanes} />
          <InfoRow label="Max deadhead" value={DRIVER.preferences.maxDeadhead} />
          <InfoRow label="Minimum rate" value={DRIVER.preferences.minRate} last />
        </Section>

        {/* Payment */}
        <Section title="Payment" icon="card">
          <InfoRow label="Method" value={DRIVER.payment.method} />
          <InfoRow label="Account" value={DRIVER.payment.account} />
          <InfoRow label="Factoring" value={DRIVER.payment.factoring} last />
        </Section>

        <Pressable style={styles.signOut}>
          <Ionicons name="log-out-outline" size={18} color={dark.danger} />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <Ionicons name={icon} size={16} color={dark.brandBright} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Card>{children}</Card>
    </View>
  );
}

function InfoRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function DocRow({ doc, last }: { doc: ProfileDoc; last: boolean }) {
  const tone = doc.status === 'valid' ? 'success' : doc.status === 'expiring' ? 'warning' : 'neutral';
  const label = doc.status === 'valid' ? 'Valid' : doc.status === 'expiring' ? 'Expiring' : 'Missing';
  return (
    <View style={[styles.docRow, !last && styles.infoRowBorder]}>
      <View style={styles.docLeft}>
        <Ionicons
          name={doc.status === 'missing' ? 'alert-circle' : 'shield-checkmark'}
          size={18}
          color={doc.status === 'missing' ? dark.textMuted : dark.brandBright}
        />
        <View>
          <Text style={styles.infoValue}>{doc.label}</Text>
          <Text style={styles.docDetail}>{doc.detail}</Text>
        </View>
      </View>
      <Pill label={label} tone={tone} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: dark.bg },
  content: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.lg },
  identity: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: dark.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: dark.borderStrong,
  },
  avatarText: { fontSize: 24, fontWeight: '800', color: dark.brandText },
  name: { fontSize: 22, fontWeight: '800', color: dark.text },
  identityMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, fontWeight: '700', color: dark.text },
  section: { gap: spacing.sm },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 2 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: dark.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
  },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: dark.border },
  infoLabel: { fontSize: 14, color: dark.textMuted },
  infoValue: { fontSize: 14, fontWeight: '600', color: dark.text, flexShrink: 1, textAlign: 'right' },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
  },
  docLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  docDetail: { fontSize: 12, color: dark.textMuted, marginTop: 2 },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.35)',
    backgroundColor: 'rgba(239,68,68,0.08)',
  },
  signOutText: { fontSize: 15, fontWeight: '700', color: dark.danger },
});
