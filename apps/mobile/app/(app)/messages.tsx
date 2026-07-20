import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CONVERSATIONS, conversationIcon, type Conversation } from '../../src/data';
import { dark, radius, spacing } from '../../src/theme';

/**
 * Messages — a modern chat list covering the dispatcher, the AI assistant, and
 * system notifications. Shows unread badges, online indicators, and a search
 * bar. Presentational only; tapping a row is a no-op for now.
 */
export default function MessagesScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.headerBar}>
        <Text style={styles.title}>Messages</Text>
        <Pressable style={styles.composeBtn}>
          <Ionicons name="create-outline" size={20} color={dark.text} />
        </Pressable>
      </View>

      {/* Search bar */}
      <View style={styles.search}>
        <Ionicons name="search" size={16} color={dark.textMuted} />
        <Text style={styles.searchPlaceholder}>Search conversations</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {CONVERSATIONS.map((c) => (
          <ConversationRow key={c.id} conversation={c} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function ConversationRow({ conversation: c }: { conversation: Conversation }) {
  const isAi = c.kind === 'ai';
  return (
    <Pressable style={styles.row}>
      <View style={styles.avatarWrap}>
        <View style={[styles.avatar, isAi && styles.avatarAi]}>
          <Ionicons name={conversationIcon(c.kind)} size={20} color={dark.brandText} />
        </View>
        {c.online && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text style={styles.rowName} numberOfLines={1}>
            {c.name}
          </Text>
          <Text style={styles.rowTime}>{c.time}</Text>
        </View>
        <View style={styles.rowBottom}>
          <Text
            style={[styles.rowPreview, c.unread > 0 && styles.rowPreviewUnread]}
            numberOfLines={1}
          >
            {c.preview}
          </Text>
          {c.unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{c.unread}</Text>
            </View>
          )}
        </View>
      </View>
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
    paddingBottom: spacing.sm,
  },
  title: { fontSize: 22, fontWeight: '800', color: dark.text },
  composeBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: dark.surface,
    borderWidth: 1,
    borderColor: dark.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    backgroundColor: dark.surface,
    borderWidth: 1,
    borderColor: dark.border,
  },
  searchPlaceholder: { fontSize: 14, color: dark.textMuted },
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl, gap: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: dark.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: dark.border,
  },
  avatarAi: { backgroundColor: 'rgba(59,130,246,0.28)' },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 13,
    height: 13,
    borderRadius: radius.full,
    backgroundColor: dark.success,
    borderWidth: 2,
    borderColor: dark.bg,
  },
  rowBody: { flex: 1, gap: 3 },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowName: { fontSize: 15, fontWeight: '700', color: dark.text, flexShrink: 1 },
  rowTime: { fontSize: 12, color: dark.textSubtle, marginLeft: spacing.sm },
  rowBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowPreview: { fontSize: 13, color: dark.textMuted, flexShrink: 1 },
  rowPreviewUnread: { color: dark.text, fontWeight: '600' },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: radius.full,
    backgroundColor: dark.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: dark.text },
});
