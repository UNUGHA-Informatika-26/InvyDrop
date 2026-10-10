import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import logo from '@/assets/logo-blackarch.png';
import { theme } from '@/theme';

interface HeroBannerProps {
  imageSrc: any;
  title: string;
  subtitle: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  className?: string;
  contentClassName?: string;
}

export function HeroBanner({
  imageSrc,
  title,
  subtitle,
  style,
  contentStyle,
}: HeroBannerProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Background image */}
      <Image
        source={imageSrc}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        priority="high"
      />

      {/* Colour overlay */}
      <View style={styles.colorOverlay} />

      {/* Scrim overlay */}
      <View style={styles.scrimOverlay} />

      {/* Content */}
      <View style={[styles.content, contentStyle]}>
        <View style={styles.row}>
          <Image
            source={logo}
            style={styles.logo}
            contentFit="contain"
          />
          <View style={styles.textColumn}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    overflow: 'hidden',
    position: 'relative',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  colorOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(217, 119, 87, 0.25)',
  },
  scrimOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(20, 20, 19, 0.45)',
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 52,
    height: 52,
    marginRight: 10,
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.font2xl,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.fontSm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
});
