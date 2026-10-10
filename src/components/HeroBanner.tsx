import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  // Compact, sleek banner height
  const bannerHeight = 115 + Math.max(insets.top, 20);

  return (
    <View style={[styles.container, { height: bannerHeight }, style]}>
      {/* Background image */}
      <Image
        source={imageSrc}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        priority="high"
      />

      {/* Colour overlay */}
      <View style={styles.colorOverlay} />

      {/* Scrim gradient overlay */}
      <View style={styles.scrimOverlay} />

      {/* Content wrapper */}
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 6,
            paddingBottom: 14,
          },
          contentStyle,
        ]}
      >
        <View style={styles.mainRow}>
          {/* Logo & Brand Info */}
          <View style={styles.brandGroup}>
            <View style={styles.logoWrapper}>
              <Image
                source={logo}
                style={styles.logo}
                contentFit="contain"
              />
            </View>
            <View style={styles.textColumn}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            </View>
          </View>

          {/* Compact Online Status Pill */}
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    backgroundColor: '#1E1D1B',
  },
  colorOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(217, 119, 87, 0.22)',
  },
  scrimOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(20, 20, 19, 0.50)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  logoWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  logo: {
    width: 30,
    height: 30,
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.90)',
    marginTop: 1,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ECA77',
    marginRight: 5,
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});


