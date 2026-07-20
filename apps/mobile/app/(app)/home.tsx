import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, Dot, Pill, SectionHeader } from '../../src/ui';
import { DISPATCH_SOURCES } from '../../src/data';
import { dark, radius, spacing } from '../../src/theme';

const RADIUS_OPTIONS = [50, 100, 150, 250];

/**
 * Home — the driver's command center. Availability toggle (Online/Offline),
 * current location, search radius, available-from time, and the live dispatch
 * search status across integrated sources. Presentational only.
 */
export default function HomeScreen() {
  const [online, setOnline] = useState(true);
  const [searchRadius, setSearchRadius] = useState(150);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>James Carter</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JC</Text>
          </View>
        </View>

        {/* Availability hero */}
        <Card style={online ? styles.heroOnline : undefined}>
          <View style={styles.heroTop}>
            <View style={styles.statusRow}>
              <Dot color={online ? dark.success : dark.textSubtle} />
              <Text style={[styles.statusText, { color: online ? dark.success : dark.textMuted }]}>
                {online ? 'ONLINE' : 'OFFLINE'}
              </Text>
            </View>
            <Switch
              value={online}
              onValueChange={setOnline}
              trackColor={{ false: dark.surfaceRaised, true: dark.success }}
              thumbColor={dark.text}
            />
          </View>

          <Text style={styles.heroTitle}>Available for Loads</Text>
          <Text style={styles.heroSubtitle}>
            {online
              ? 'Your truck is live. Dispatch is finding your next load.'
              : 'Go online and our dispatch team takes it from here.'}
          </Text>

          {/* Location + available from */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={16} color={dark.brandBright} />
              <View>
                <Text style={styles.infoLabel}>Current location</Text>
                <Text style={styles.infoValue}>Dallas, TX</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time" size={16} color={dark.brandBright} />
              <View>
                <Text style={styles.infoLabel}>Available from</Text>
                <Text style={styles.infoValue}>Now</Text>
              </View>
            </View>
          </View>

          {/* Search radius */}
          <Text style={styles.radiusLabel}>Search radius</Text>
          <View style={styles.radiusRow}>
            {RADIUS_OPTIONS.map((r) => {
              const active = r === searchRadius;
              return (
                <Pressable
                  key={r}
                  onPress={() => setSearchRadius(r)}
                  style={[styles.radiusChip, active && styles.radiusChipActive]}
                >
                  <Text style={[styles.radiusChipText, active && styles.radiusChipTextActive]}>
                    {r} mi
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* Live dispatch search status */}
        {online && (
          <View style={styles.section}>
            <SectionHeader
              title="Live dispatch search"
              trailing={<Pill label="Scanning" tone="brand" icon="radio" />}
            />
            <Card>
              {DISPATCH_SOURCES.map((source, index) => (
                <View
                  key={source.key}
                  style={[styles.sourceRow, index > 0 && styles.sourceRowBorder]}
                >
                  <View style={styles.sourceLeft}>
                    <View style={styles.sourceIcon}>
                      <Ionicons name="server" size={16} color={dark.brandBright} />
                    </View>
                    <Text style={styles.sourceLabel}>{source.label}</Text>
                  </View>
                  {source.status === 'connected' ? (
                    <Pill label="Connected" tone="success" icon="checkmark-circle" />
                  ) : (
                    <Pill label="Searching" tone="brand" />
                  )}
                </View>
              ))}
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: dark.bg },
  content: { padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: { fontSize: 14, color: dark.textMuted },
  name: { fontSize: 22, fontWeight: '700', color: dark.text },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: dark.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: dark.borderStrong,
  },
  avatarText: { color: dark.brandText, fontWeight: '700' },
  heroOnline: {
    borderColor: 'rgba(37,99,235,0.4)',
    backgroundColor: dark.surfaceRaised,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusText: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: dark.text },
  heroSubtitle: { fontSize: 14, color: dark.textMuted, marginTop: 4, lineHeight: 20 },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: dark.overlay,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  infoLabel: { fontSize: 11, color: dark.textMuted },
  infoValue: { fontSize: 14, fontWeight: '700', color: dark.text },
  radiusLabel: {
    fontSize: 11,
    color: dark.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  radiusRow: { flexDirection: 'row', gap: spacing.sm },
  radiusChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: dark.overlay,
    borderWidth: 1,
    borderColor: dark.border,
  },
  radiusChipActive: {
    backgroundColor: dark.brandSoft,
    borderColor: dark.brandBright,
  },
  radiusChipText: { fontSize: 13, fontWeight: '600', color: dark.textMuted },
  radiusChipTextActive: { color: dark.brandText },
  section: { gap: 0 },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  sourceRowBorder: { borderTopWidth: 1, borderTopColor: dark.border },
  sourceLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sourceIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: dark.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceLabel: { fontSize: 15, fontWeight: '600', color: dark.text },
});
