import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Download, Trash2, LogOut } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useInventory } from '@/context/InventoryContext';
import { useRouter } from 'expo-router';
import { toast } from '@/components/ui/Toast';
import { theme } from '@/theme';

type ThemeMode = 'Terang' | 'Gelap' | 'Sistem';

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { items, clearAllItems } = useInventory();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [themeMode, setThemeMode] = useState<ThemeMode>('Sistem');

  const displayName = user?.name || 'John Doe';
  const displayEmail = user?.email || 'johndoe@yahoo.id';

  // Calculate initials from name (e.g. "John Doe" -> "JD")
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'JD';

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah Anda yakin ingin keluar dari akun ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await logout();
            toast.success('Berhasil keluar');
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleExportData = async () => {
    try {
      if (items.length === 0) {
        toast.info('Belum ada data inventaris untuk diekspor');
        return;
      }
      const dataStr = JSON.stringify(items, null, 2);
      await Share.share({
        title: 'Ekspor Data Inventaris Gudang',
        message: dataStr,
      });
      toast.success('Data inventaris berhasil diekspor');
    } catch (e) {
      console.error('Error exporting data:', e);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Hapus Semua Data',
      'Apakah Anda yakin ingin menghapus semua data inventaris? Tindakan ini tidak dapat dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus Semua',
          style: 'destructive',
          onPress: () => {
            clearAllItems();
            toast.success('Semua data inventaris berhasil dihapus');
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top, 16) + 12,
          paddingBottom: Math.max(insets.bottom, 24) + 20,
        },
      ]}
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
    >
      {/* Title */}
      <Text style={styles.headerTitle}>Pengaturan</Text>

      {/* User Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileEmail}>{displayEmail}</Text>
        </View>
      </View>

      {/* Section 1: Tampilan */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Tampilan</Text>
        <View style={styles.segmentContainer}>
          {(['Terang', 'Gelap', 'Sistem'] as ThemeMode[]).map(mode => {
            const isSelected = themeMode === mode;
            return (
              <Pressable
                key={mode}
                style={[
                  styles.segmentTab,
                  isSelected && styles.segmentTabActive,
                ]}
                onPress={() => {
                  setThemeMode(mode);
                  toast.info(`Mode tema diubah ke ${mode}`);
                }}
              >
                <Text
                  style={[
                    styles.segmentText,
                    isSelected && styles.segmentTextActive,
                  ]}
                >
                  {mode}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Section 2: Data */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Data</Text>
        <View style={styles.cardGroup}>
          <Pressable
            style={({ pressed }) => [styles.rowItem, pressed && styles.rowItemPressed]}
            onPress={handleExportData}
          >
            <Download size={20} color={theme.colors.foreground} style={styles.rowIcon} />
            <Text style={styles.rowLabel}>Ekspor Data</Text>
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={({ pressed }) => [styles.rowItem, pressed && styles.rowItemPressed]}
            onPress={handleClearData}
          >
            <Trash2 size={20} color={styles.dangerColor.color} style={styles.rowIcon} />
            <Text style={styles.rowLabelDanger}>Hapus Semua Data</Text>
          </Pressable>
        </View>
      </View>

      {/* Section 3: Tentang */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Tentang</Text>
        <View style={styles.cardGroup}>
          <View style={styles.rowItemBetween}>
            <Text style={styles.rowLabel}>Versi aplikasi</Text>
            <Text style={styles.versionValue}>v1.0.0</Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutWrapper}>
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, pressed && styles.logoutBtnPressed]}
          onPress={handleLogout}
        >
          <LogOut size={20} color={styles.dangerColor.color} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Keluar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9F8F5',
  },
  content: {
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
    letterSpacing: -0.5,
  },

  // Profile Card
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F5E4DC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#C85A32',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  profileEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  // Sections
  section: {
    marginBottom: 22,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
    paddingLeft: 2,
  },

  // Segmented Control (Tampilan)
  segmentContainer: {
    backgroundColor: '#EDEBE6',
    borderRadius: 14,
    padding: 4,
    flexDirection: 'row',
    height: 48,
  },
  segmentTab: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentTabActive: {
    backgroundColor: '#F9E8E1',
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  segmentTextActive: {
    color: '#C85A32',
    fontWeight: '700',
  },

  // Card Group (Data, Tentang)
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  rowItemPressed: {
    backgroundColor: '#F9FAFB',
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  rowLabelDanger: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C85A32',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F2EE',
    marginLeft: 16,
  },
  rowItemBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  versionValue: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Logout Button
  logoutWrapper: {
    marginTop: 20,
    marginBottom: 16,
  },
  logoutBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECEAE5',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  logoutBtnPressed: {
    backgroundColor: '#FBF9F7',
    opacity: 0.9,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C85A32',
  },
  dangerColor: {
    color: '#C85A32',
  },
});