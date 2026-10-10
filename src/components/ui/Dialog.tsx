import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { theme } from '../../theme';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => onOpenChange(false)}
        />
        <View style={styles.contentContainer} pointerEvents="box-none">
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function DialogContent({
  children,
  style,
  scrollable = false,
  contentContainerStyle,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  className?: string;
}) {
  if (scrollable) {
    return (
      <View style={[styles.dialogCard, style]}>
        <ScrollView
          bounces={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.dialogCard, style]}>
      {children}
    </View>
  );
}

export function DialogHeader({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}) {
  return <View style={[styles.header, style]}>{children}</View>;
}

export function DialogTitle({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  className?: string;
}) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function DialogDescription({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  className?: string;
}) {
  return <Text style={[styles.description, style]}>{children}</Text>;
}

export function DialogFooter({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 400,
  },
  dialogCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: 20,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  scrollContent: {
    flexGrow: 0,
  },
  header: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontXl,
    fontWeight: '700',
    color: theme.colors.foreground,
  },
  description: {
    fontSize: theme.typography.fontSm,
    color: theme.colors.mutedForeground,
    marginTop: theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
});
