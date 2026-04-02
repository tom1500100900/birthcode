import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import Row from '@/components/Row';
import SectionTitle from '@/components/SectionTitle';
import { formatPlacementLabel } from '@/lib/astro/labels';
import { useLocale } from '@/lib/i18n/useLocale';
import { ButtonPrimary, ButtonSecondary, Card, Screen, TextField } from '@/src/components';
import { colors } from '@/src/theme/colors';
import { radius } from '@/src/theme/radius';
import { spacing } from '@/src/theme/spacing';
import { typography } from '@/src/theme/typography';
import { useBirthcodeStore } from '@/store/useBirthcodeStore';

export default function ProfilesManagerScreen() {
  const { t } = useLocale();
  const profiles = useBirthcodeStore((state) => state.profiles);
  const activeProfileId = useBirthcodeStore((state) => state.activeProfileId);
  const setActiveProfile = useBirthcodeStore((state) => state.setActiveProfile);
  const updateProfileLabel = useBirthcodeStore((state) => state.updateProfileLabel);
  const deleteProfile = useBirthcodeStore((state) => state.deleteProfile);

  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<string>('');

  const sortedProfiles = useMemo(
    () => [...profiles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [profiles]
  );

  const beginRename = (id: string, label: string) => {
    setEditingProfileId(id);
    setEditingLabel(label);
  };

  const saveRename = async () => {
    if (!editingProfileId) {
      return;
    }
    await updateProfileLabel(editingProfileId, editingLabel);
    setEditingProfileId(null);
    setEditingLabel('');
  };

  const confirmDelete = (id: string, label: string) => {
    Alert.alert(t('profiles.deleteTitle'), t('profiles.deleteMessage', { label }), [
      { text: t('settings.cancel'), style: 'cancel' },
      {
        text: t('profiles.delete'),
        style: 'destructive',
        onPress: () => void deleteProfile(id),
      },
    ]);
  };

  return (
    <Screen scroll>
      <View style={styles.container}>
        <SectionTitle title={t('profiles.title')} subtitle={t('profiles.subtitle')} />
        <ButtonPrimary label={t('profiles.createNew')} onPress={() => router.push('/onboarding')} />
        {sortedProfiles.length === 0 ? (
          <Card>
            <Text style={styles.empty}>{t('profiles.empty')}</Text>
          </Card>
        ) : (
          sortedProfiles.map((profile) => {
            const isActive = profile.id === activeProfileId;
            const isEditing = profile.id === editingProfileId;
            const chart = profile.astroResult?.chart ?? null;
            return (
              <Card key={profile.id}>
                {isEditing ? (
                  <View style={styles.editRow}>
                    <TextField
                      label={t('profiles.renameLabel')}
                      placeholder={t('profiles.renamePlaceholder')}
                      value={editingLabel}
                      onChangeText={setEditingLabel}
                    />
                    <View style={styles.editActions}>
                      <ButtonSecondary label={t('profiles.cancel')} onPress={() => setEditingProfileId(null)} />
                      <ButtonPrimary label={t('profiles.save')} onPress={() => void saveRename()} />
                    </View>
                  </View>
                ) : (
                  <View style={[styles.profileRow, isActive && styles.profileRowActive]}>
                    <Pressable onPress={() => setActiveProfile(profile.id)} style={styles.profilePressable}>
                      <View style={styles.profileHeader}>
                        <Text style={styles.profileLabel}>{profile.label}</Text>
                        {isActive ? <Text style={styles.activeTag}>{t('profiles.active')}</Text> : null}
                      </View>
                      {chart ? (
                        <View style={styles.summary}>
                          <Row label={t('profile.sun')} value={formatPlacementLabel(chart.sun)} />
                          <Row label={t('profile.moon')} value={formatPlacementLabel(chart.moon)} />
                          <Row
                            label={t('profile.ascendant')}
                            value={formatPlacementLabel({
                              name: 'Ascendant',
                              sign: chart.ascendant.sign,
                              degree: chart.ascendant.degree,
                            })}
                          />
                        </View>
                      ) : (
                        <Text style={styles.pending}>{t('profiles.notGenerated')}</Text>
                      )}
                    </Pressable>
                    <View style={styles.rowActions}>
                      <Pressable onPress={() => beginRename(profile.id, profile.label)} style={styles.rowActionButton}>
                        <Text style={styles.rowActionText}>{t('profiles.rename')}</Text>
                      </Pressable>
                      <Pressable onPress={() => router.push('/onboarding')} style={styles.rowActionButton}>
                        <Text style={styles.rowActionText}>Edit birth data</Text>
                      </Pressable>
                      <Pressable onPress={() => confirmDelete(profile.id, profile.label)} style={styles.rowActionButton}>
                        <Text style={[styles.rowActionText, styles.deleteText]}>{t('profiles.delete')}</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </Card>
            );
          })
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  empty: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
  },
  editRow: {
    gap: spacing.sm,
  },
  editActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  profileRow: {
    gap: spacing.sm,
  },
  profilePressable: {
    gap: spacing.sm,
  },
  profileRowActive: {
    borderWidth: 1,
    borderColor: colors.accentStrong,
    borderRadius: radius.md,
    padding: spacing.sm,
    backgroundColor: colors.cardElevated,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  profileLabel: {
    color: colors.textPrimary,
    fontSize: typography.bodyLg,
    fontWeight: '700',
  },
  activeTag: {
    color: colors.accentStrong,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  summary: {
    gap: spacing.xs,
  },
  pending: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
  },
  rowActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  rowActionButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.bgSoft,
  },
  rowActionText: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  deleteText: {
    color: colors.danger,
  },
});
