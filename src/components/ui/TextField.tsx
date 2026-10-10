import React from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  TextStyle,
  View,
} from 'react-native';
import { theme } from '../../theme';

export interface TextFieldProps extends Omit<TextInputProps, 'onChange'> {
  style?: StyleProp<TextStyle>;
  onChangeText?: (text: string) => void;
  onChange?: (e: any) => void;
  type?: string;
  className?: string;
  required?: boolean;
}

export function TextField({
  style,
  onChangeText,
  onChange,
  type,
  placeholderTextColor = theme.colors.mutedForeground,
  secureTextEntry,
  keyboardType,
  ...rest
}: TextFieldProps) {
  const handleChangeText = (text: string) => {
    if (onChangeText) onChangeText(text);
    if (onChange) onChange({ target: { value: text } });
  };

  const isPassword = type === 'password' || secureTextEntry;
  const resolvedKeyboardType =
    keyboardType || (type === 'number' ? 'numeric' : type === 'email' ? 'email-address' : 'default');

  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={placeholderTextColor}
      onChangeText={handleChangeText}
      secureTextEntry={isPassword}
      keyboardType={resolvedKeyboardType}
      {...rest}
    />
  );
}

export const Input = TextField;

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontBase,
    color: theme.colors.foreground,
  },
});
