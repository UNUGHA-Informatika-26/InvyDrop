import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Label } from '@/components/ui/Label';
import { LogIn } from 'lucide-react-native';
import { toast } from '@/components/ui/Toast';
import { HeroBanner } from './HeroBanner';
import loginBg from '@/assets/bulan-jatuh4.png';
import { theme } from '@/theme';

export function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      toast.error('Harap isi semua kolom');
      return;
    }

    setIsLoading(true);
    const success = await login(formData.email.trim(), formData.password);
    setIsLoading(false);

    if (success) {
      toast.success('Selamat datang kembali!');
      router.replace('/');
    } else {
      toast.error('Email atau password salah');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Image */}
        <HeroBanner
          imageSrc={loginBg}
          title="InvyDrop"
          subtitle="North-East Logistics Hub"
        />

        {/* Login Form */}
        <View style={styles.formContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Welcome Back</Text>
            <Text style={styles.subheading}>Sign in to access your inventory</Text>
          </View>

          <View style={styles.formFields}>
            <View style={styles.fieldGroup}>
              <Label>Email Address</Label>
              <TextField
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={email => setFormData(prev => ({ ...prev, email }))}
                placeholder="your.email@company.com"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Label>Password</Label>
              <TextField
                type="password"
                value={formData.password}
                onChangeText={password => setFormData(prev => ({ ...prev, password }))}
                placeholder="Enter your password"
              />
            </View>

            <Button
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.submitBtn}
            >
              <LogIn size={18} color={theme.colors.white} style={styles.btnIcon} />
              <Text style={styles.submitBtnText}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Text>
            </Button>
          </View>

          <View style={styles.footerLink}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/signup')}
              style={styles.linkText}
            >
              <Text style={styles.linkHighlight}>Sign up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  titleSection: {
    marginBottom: 24,
  },
  heading: {
    fontSize: theme.typography.font2xl,
    fontWeight: '800',
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  subheading: {
    fontSize: theme.typography.fontBase,
    color: theme.colors.mutedForeground,
  },
  formFields: {
    gap: 16,
  },
  fieldGroup: {
    gap: 4,
  },
  submitBtn: {
    height: 52,
    marginTop: 8,
  },
  btnIcon: {
    marginRight: 8,
  },
  submitBtnText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: theme.typography.fontBase,
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: theme.typography.fontBase,
    color: theme.colors.mutedForeground,
  },
  linkText: {
    paddingVertical: 4,
  },
  linkHighlight: {
    fontSize: theme.typography.fontBase,
    fontWeight: '700',
    color: theme.colors.primary,
  },
});