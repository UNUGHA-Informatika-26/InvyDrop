import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  Settings as SettingsIcon,
  Building2,
  Database,
  Info,
  HelpCircle,
  LogOut,
  User,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import { theme } from '../../theme';

export function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconCircle}>
          <SettingsIcon size={26} color={theme.colors.primary} />
        </View>
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Configure your warehouse system</Text>
        </View>
      </View>

      {/* Settings Options */}
      <View style={styles.optionsList}>
        {/* User Profile */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconCircleInfo}>
              <User size={22} color={theme.colors.info} />
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.cardTitle}>User Profile</Text>
              <Text style={styles.cardValue}>{user?.name || 'Administrator'}</Text>
              <Text style={styles.cardSubValue}>{user?.email || 'admin@warehouse.local'}</Text>
            </View>
          </View>
        </View>

        {/* Facility Location */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconCirclePrimary}>
              <Building2 size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.cardTitle}>Facility Location</Text>
              <Text style={styles.cardValue}>North-East Logistics Hub</Text>
            </View>
          </View>
        </View>

        {/* Storage Strategy */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconCirclePrimary}>
              <Database size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.cardTitle}>Storage Strategy</Text>
              <Text style={styles.cardValue}>Local Database (Offline-First)</Text>
            </View>
          </View>
        </View>

        {/* App Version */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconCirclePrimary}>
              <Info size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.cardTitle}>App Version</Text>
              <Text style={styles.cardValue}>WarehouseFlow v1.0.0 (Native Mobile)</Text>
            </View>
          </View>
        </View>

        {/* Quick Help */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconCirclePrimary}>
              <HelpCircle size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.cardTitle}>Quick Help</Text>
              <View style={styles.helpList}>
                <Text style={styles.helpItem}>• Gunakan tombol + untuk menambah barang baru</Text>
                <Text style={styles.helpItem}>• Tekan Masuk/Keluar untuk mengubah kuantitas</Text>
                <Text style={styles.helpItem}>• Cek ringkasan di tab Statistics</Text>
                <Text style={styles.helpItem}>• Notifikasi stok menipis muncul otomatis</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <Button
          variant="destructive"
          onPress={handleLogout}
          style={styles.logoutBtn}
        >
          <LogOut size={18} color={theme.colors.white} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </Button>
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.copyright}>© 2026 WarehouseFlow</Text>
        <Text style={styles.company}>International Logistics Solutions</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    marginTop: 8,
  },
  headerIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.typography.font2xl,
    fontWeight: '800',
    color: theme.colors.foreground,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSm,
    color: theme.colors.mutedForeground,
    marginTop: 2,
  },
  optionsList: {
    gap: 12,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  iconCircleInfo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.infoSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCirclePrimary: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.typography.fontBase,
    fontWeight: '700',
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: theme.typography.fontSm,
    color: theme.colors.mutedForeground,
  },
  cardSubValue: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.mutedForeground,
    marginTop: 2,
    opacity: 0.8,
  },
  helpList: {
    marginTop: 6,
    gap: 4,
  },
  helpItem: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.mutedForeground,
    lineHeight: 18,
  },
  logoutBtn: {
    height: 50,
    marginTop: 8,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: theme.typography.fontBase,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  copyright: {
    fontSize: theme.typography.fontSm,
    color: theme.colors.mutedForeground,
  },
  company: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.mutedForeground,
    opacity: 0.7,
    marginTop: 4,
  },
});