import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '../theme';

export interface ScreenScaffoldProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** Optional preview of planned capabilities for this screen. */
  upcoming?: string[];
}

/**
 * Consistent screen scaffold for the driver app. Presents the section title,
 * purpose, and a preview of planned capabilities. Layout/navigation scaffolding
 * only — no business logic or data.
 */
export function ScreenScaffold({ title, description, icon, upcoming }: ScreenScaffoldProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconBubble}>
          <Ionicons name={icon} size={26} color={colors.brand} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>COMING SOON</Text>
          </View>
          {upcoming && upcoming.length > 0 ? (
            <View style={styles.list}>
              {upcoming.map((item) => (
                <View key={item} style={styles.listItem}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.brand} />
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.description}>
              This screen is ready for its features. Functionality arrives in a later phase.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.neutral50,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  iconBubble: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.navy,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.neutral600,
  },
  card: {
    marginTop: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: spacing.lg,
    gap: spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.neutral100,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: colors.neutral500,
  },
  list: {
    gap: spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.neutral900,
  },
});
