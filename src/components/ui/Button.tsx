import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { theme } from '../../theme';

export interface ButtonProps {
  children?: React.ReactNode;
  onPress?: () => void;
  onClick?: () => void; // for backwards compatibility
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string; // no-op for compatibility
  ariaLabel?: string;
}

export function Button({
  children,
  onPress,
  onClick,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const handlePress = onPress || onClick;

  const getVariantStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'destructive':
        return styles.destructiveButton;
      case 'ghost':
        return styles.ghostButton;
      default:
        return styles.defaultButton;
    }
  };

  const getVariantTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineText;
      case 'secondary':
        return styles.secondaryText;
      case 'destructive':
        return styles.destructiveText;
      case 'ghost':
        return styles.ghostText;
      default:
        return styles.defaultText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.smButton;
      case 'lg':
        return styles.lgButton;
      default:
        return styles.defaultSizeButton;
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.baseButton,
        getSizeStyle(),
        getVariantStyle(),
        disabled && styles.disabledButton,
        pressed && styles.pressedButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'default' ? theme.colors.primaryForeground : theme.colors.primary}
        />
      ) : typeof children === 'string' || typeof children === 'number' ? (
        <Text style={[styles.baseText, getVariantTextStyle(), textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radii.md,
  },
  defaultSizeButton: {
    height: 48,
    paddingHorizontal: theme.spacing.lg,
  },
  smButton: {
    height: 38,
    paddingHorizontal: theme.spacing.md,
  },
  lgButton: {
    height: 52,
    paddingHorizontal: theme.spacing.xl,
  },
  defaultButton: {
    backgroundColor: theme.colors.primary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  destructiveButton: {
    backgroundColor: theme.colors.destructive,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.5,
  },
  pressedButton: {
    opacity: 0.82,
  },
  baseText: {
    fontSize: theme.typography.fontBase,
    fontWeight: '600',
  },
  defaultText: {
    color: theme.colors.primaryForeground,
  },
  outlineText: {
    color: theme.colors.foreground,
  },
  secondaryText: {
    color: theme.colors.secondaryForeground,
  },
  destructiveText: {
    color: theme.colors.primaryForeground,
  },
  ghostText: {
    color: theme.colors.foreground,
  },
});
