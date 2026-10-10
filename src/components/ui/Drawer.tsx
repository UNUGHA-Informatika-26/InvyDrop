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

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}

export function Drawer({ open, onOpenChange, children }: DrawerProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
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
        <View style={styles.sheet} pointerEvents="box-none">
          <View style={styles.dragHandle} />
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function DrawerContent({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}) {
  return (
    <View style={[styles.content, style]}>
      <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </View>
  );
}

export function DrawerHeader({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}) {
  return <View style={[styles.header, style]}>{children}</View>;
}

export function DrawerTitle({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  className?: string;
}) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function DrawerDescription({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}) {
  return <View style={[styles.descriptionWrapper, style]}>{children}</View>;
}

export function DrawerFooter({
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
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radii.xl,
    borderTopRightRadius: theme.radii.xl,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xxl,
    maxHeight: '85%',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginBottom: theme.spacing.sm,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontXl,
    fontWeight: '700',
    color: theme.colors.foreground,
  },
  descriptionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
});
