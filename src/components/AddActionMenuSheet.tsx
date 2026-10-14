import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PackagePlus, ClipboardCheck, ChevronRight } from 'lucide-react-native';

interface AddActionMenuSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectAddItem: () => void;
  onSelectOpname: () => void;
}

const TOKENS = {
  primary: '#E06A3B',
  primaryTint: 'rgba(224, 106, 59, 0.12)',
  success: '#768E65',
  successTint: 'rgba(118, 142, 101, 0.12)',
  background: '#FBF9F5',
  card: '#FFFFFF',
  stroke: '#EAE3D9',
  textDark: '#2C2623',
  textMuted: '#7A726A',
  backdrop: 'rgba(44, 38, 35, 0.4)',
};

export function AddActionMenuSheet({
  visible,
  onClose,
  onSelectAddItem,
  onSelectOpname,
}: AddActionMenuSheetProps) {
  const insets = useSafeAreaInsets();

  const panelAnim = useRef(new Animated.Value(0)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      panelAnim.setValue(0);
      card1Anim.setValue(0);
      card2Anim.setValue(0);

      Animated.parallel([
        Animated.timing(panelAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.stagger(60, [
          Animated.timing(card1Anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(card2Anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [visible, panelAnim, card1Anim, card2Anim]);

  const panelTranslateY = panelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [120, 0],
  });

  const card1TranslateY = card1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  const card2TranslateY = card2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  const handlePressAddItem = () => {
    onClose();
    onSelectAddItem();
  };

  const handlePressOpname = () => {
    onClose();
    onSelectOpname();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      statusBarTranslucent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Tutup menu aksi"
        />

        <Animated.View
          style={[
            styles.panel,
            {
              paddingBottom: insets.bottom + 12,
              opacity: panelAnim,
              transform: [{ translateY: panelTranslateY }],
            },
          ]}
        >
          {/* Pill Drag Indicator */}
          <View style={styles.pillIndicator} />

          {/* Header */}
          <Text style={styles.title}>Pilih Aksi</Text>
          <Text style={styles.subtitle}>Apa yang ingin Anda lakukan?</Text>

          {/* Kartu 1: Tambah Barang */}
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: card1Anim,
                transform: [{ translateY: card1TranslateY }],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.card}
              onPress={handlePressAddItem}
              accessibilityRole="button"
              accessibilityLabel="Tambah barang baru"
            >
              <View style={[styles.iconBox, styles.addItemIconBox]}>
                <PackagePlus size={24} color={TOKENS.primary} strokeWidth={2} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Tambah Barang</Text>
                <Text style={styles.cardSubtitle}>
                  Daftarkan barang baru ke gudang
                </Text>
              </View>
              <ChevronRight size={20} color={TOKENS.textMuted} strokeWidth={2} />
            </TouchableOpacity>
          </Animated.View>

          {/* Kartu 2: Stock Opname */}
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: card2Anim,
                transform: [{ translateY: card2TranslateY }],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.card}
              onPress={handlePressOpname}
              accessibilityRole="button"
              accessibilityLabel="Mulai sesi stock opname"
            >
              <View style={[styles.iconBox, styles.opnameIconBox]}>
                <ClipboardCheck size={24} color={TOKENS.success} strokeWidth={2} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Stock Opname</Text>
                <Text style={styles.cardSubtitle}>
                  Cocokkan stok sistem dengan stok fisik gudang
                </Text>
              </View>
              <ChevronRight size={20} color={TOKENS.textMuted} strokeWidth={2} />
            </TouchableOpacity>
          </Animated.View>

          {/* Tombol Batal */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            style={styles.cancelButton}
            accessibilityRole="button"
            accessibilityLabel="Batal"
          >
            <Text style={styles.cancelText}>Batal</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: TOKENS.backdrop,
  },
  panel: {
    backgroundColor: TOKENS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16,
  },
  pillIndicator: {
    width: 40,
    height: 4,
    backgroundColor: TOKENS.stroke,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: TOKENS.textDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: TOKENS.textMuted,
    textAlign: 'center',
    marginBottom: 16,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: TOKENS.stroke,
    backgroundColor: TOKENS.card,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  addItemIconBox: {
    backgroundColor: TOKENS.primaryTint,
  },
  opnameIconBox: {
    backgroundColor: TOKENS.successTint,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TOKENS.textDark,
  },
  cardSubtitle: {
    fontSize: 13,
    color: TOKENS.textMuted,
    marginTop: 2,
  },
  cancelButton: {
    alignItems: 'center',
    padding: 12,
    marginTop: 4,
  },
  cancelText: {
    fontSize: 14,
    color: TOKENS.textMuted,
    fontWeight: '500',
  },
});
