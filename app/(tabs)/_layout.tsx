import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Tabs } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { useLocale } from '@/lib/i18n/useLocale';
import { ProfileHeaderPill } from '@/src/components';
import { colors } from '@/src/theme/colors';
import { selectActiveProfile, useBirthcodeStore } from '@/store/useBirthcodeStore';

export default function TabLayout() {
  const { t } = useLocale();
  const activeProfile = useBirthcodeStore(selectActiveProfile);
  const profileSwitchLabel = activeProfile
    ? t('tabs.activeProfile', { label: activeProfile.label })
    : t('tabs.activeProfileFallback');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accentStrong,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.bgSoft,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.bg,
        },
        headerTitleStyle: {
          color: colors.textPrimary,
          fontWeight: '700',
        },
        headerLeft: () => (
          <Pressable onPress={() => router.push('/menu')} hitSlop={8} style={{ marginLeft: 12 }}>
            <Ionicons name="home-outline" size={20} color={colors.textPrimary} />
          </Pressable>
        ),
        headerShown: true,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="ask" options={{ href: null }} />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="birthcode"
        options={{
          title: 'Birthcode',
          headerTitle: () => (
            <ProfileHeaderPill
              label={profileSwitchLabel}
              onPress={() => router.push('/profiles')}
            />
          ),
          tabBarIcon: ({ color, size }) => <Ionicons name="reader-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          headerTitle: () => (
            <ProfileHeaderPill
              label={profileSwitchLabel}
              onPress={() => router.push('/profiles')}
            />
          ),
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chart"
        options={{
          title: t('tabs.chart'),
          headerTitle: () => (
            <ProfileHeaderPill
              label={profileSwitchLabel}
              onPress={() => router.push('/profiles')}
            />
          ),
          tabBarIcon: ({ color, size }) => <Ionicons name="planet-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: t('tabs.insights'),
          headerTitle: () => (
            <ProfileHeaderPill
              label={profileSwitchLabel}
              onPress={() => router.push('/profiles')}
            />
          ),
          tabBarIcon: ({ color, size }) => <Ionicons name="sparkles-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="match"
        options={{
          title: 'Match',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="acts"
        options={{
          title: t('tabs.practices'),
          headerTitle: () => (
            <ProfileHeaderPill
              label={profileSwitchLabel}
              onPress={() => router.push('/profiles')}
            />
          ),
          tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-done-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: t('tabs.saved'),
          tabBarIcon: ({ color, size }) => <Ionicons name="bookmark-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="definitions"
        options={{
          title: t('tabs.definitions'),
          tabBarIcon: ({ color, size }) => <Ionicons name="help-circle-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
