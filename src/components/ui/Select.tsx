import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { theme } from '../../theme';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  value?: string;
  onValueChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = 'Pilih opsi',
  style,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(o => o.value === value);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => setIsOpen(true)}
        style={[styles.selectTrigger, style]}
      >
        <Text style={selectedOption ? styles.selectedText : styles.placeholderText}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
          <View style={styles.optionsCard}>
            <FlatList
              data={options}
              showsVerticalScrollIndicator={false}
              overScrollMode="never"
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.optionItem,
                    item.value === value && styles.optionItemSelected,
                    pressed && styles.optionItemPressed,
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setIsOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selectTrigger: {
    height: 48,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    justifyContent: 'center',
  },
  selectedText: {
    fontSize: theme.typography.fontBase,
    color: theme.colors.foreground,
  },
  placeholderText: {
    fontSize: theme.typography.fontBase,
    color: theme.colors.mutedForeground,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  optionsCard: {
    width: '100%',
    maxWidth: 360,
    maxHeight: 320,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.xs,
    elevation: 8,
  },
  optionItem: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  optionItemSelected: {
    backgroundColor: theme.colors.primarySoft,
  },
  optionItemPressed: {
    opacity: 0.7,
  },
  optionText: {
    fontSize: theme.typography.fontBase,
    color: theme.colors.foreground,
  },
  optionTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
