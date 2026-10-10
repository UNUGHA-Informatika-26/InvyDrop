import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Package, BarChart3, Plus, ScanLine, Settings } from 'lucide-react-native';
import { theme } from '../../theme';

interface BottomNavProps {
  onAddClick: () => void;
  onScanClick: () => void;
}

export function BottomNav({ onAddClick, onScanClick }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isInventoryActive = pathname === '/' || pathname === '' || pathname === '/index';
  const isStatsActive = pathname === '/statistics';
  const isSettingsActive = pathname === '/settings';

  return (
    <View style={styles.navBar}>
      <View style={styles.navContent}>
        {/* Slot 1: Inventory */}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/')}
          style={styles.tabButton}
        >
          <View
            style={[
              styles.tabInner,
              isInventoryActive && styles.activeTabInner,
            ]}
          >
            <Package
              size={22}
              color={isInventoryActive ? theme.colors.primary : theme.colors.mutedForeground}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.tabLabel,
                isInventoryActive && styles.activeTabLabel,
              ]}
            >
              Inventory
            </Text>
          </View>
        </Pressable>

        {/* Slot 2: Statistics */}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/statistics')}
          style={styles.tabButton}
        >
          <View
            style={[
              styles.tabInner,
              isStatsActive && styles.activeTabInner,
            ]}
          >
            <BarChart3
              size={22}
              color={isStatsActive ? theme.colors.primary : theme.colors.mutedForeground}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.tabLabel,
                isStatsActive && styles.activeTabLabel,
              ]}
            >
              Statistics
            </Text>
          </View>
        </Pressable>

        {/* Slot 3: Tambah (Floating center action) */}
        <View style={styles.centerContainer}>
          <Pressable
            accessibilityRole="button"
            onPress={onAddClick}
            style={({ pressed }) => [
              styles.floatingAddBtn,
              pressed && styles.floatingAddBtnPressed,
            ]}
          >
            <Plus size={26} color={theme.colors.white} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.centerLabel}>Tambah</Text>
        </View>

        {/* Slot 4: Scan (Action) */}
        <Pressable
          accessibilityRole="button"
          onPress={onScanClick}
          style={styles.tabButton}
        >
          <View style={styles.tabInner}>
            <ScanLine
              size={22}
              color={theme.colors.mutedForeground}
              strokeWidth={2}
            />
            <Text style={styles.tabLabel}>Scan</Text>
          </View>
        </Pressable>

        {/* Slot 5: Settings */}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/settings')}
          style={styles.tabButton}
        >
          <View
            style={[
              styles.tabInner,
              isSettingsActive && styles.activeTabInner,
            ]}
          >
            <Settings
              size={22}
              color={isSettingsActive ? theme.colors.primary : theme.colors.mutedForeground}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.tabLabel,
                isSettingsActive && styles.activeTabLabel,
              ]}
            >
              Settings
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: 20,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  navContent: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: theme.radii.lg,
  },
  activeTabInner: {
    backgroundColor: theme.colors.primarySoft,
  },
  tabLabel: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.mutedForeground,
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: -12,
  },
  floatingAddBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  floatingAddBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.95 }],
  },
  centerLabel: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.mutedForeground,
    marginTop: 2,
    fontWeight: '500',
  },
});
