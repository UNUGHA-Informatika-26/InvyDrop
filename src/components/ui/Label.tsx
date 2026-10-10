import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { theme } from '../../theme';

export interface LabelProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  htmlFor?: string;
  className?: string;
}

export function Label({ children, style }: LabelProps) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: theme.typography.fontSm,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
  },
});
