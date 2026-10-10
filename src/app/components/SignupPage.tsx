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
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Label } from '@/components/ui/Label';
import { UserPlus } from 'lucide-react-native';
import { toast } from '@/components/ui/Toast';
import { HeroBanner } from './HeroBanner';
import signupBg from '@/assets/bulan-jatuh.png';
import { theme } from '../../theme';

export function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Harap isi semua kolom');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);
    const success = await signup(
      formData.name.trim(),
      formData.email.trim(),
      formData.password
    );
    setIsLoading(false);

    if (success) {
      toast.success('Akun berhasil dibuat!');
      router.replace('/');
    } else {
      toast.error('Email sudah terdaftar');
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
          imageSrc={signupBg}
          title="InvyDrop"
          subtitle="North-East Logistics Hub"
        />

        {/* Signup Form */}
        <View style={styles.formContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Create Account</Text>
            <Text style={styles.subheading}>Join the warehouse management team</Text>
          </View>

          <View style={styles.formFields}>
            <View style={styles.fieldGroup}>
              <Label>Full Name</Label>
              <TextField
                value={formData.name}
                onChangeText={name => setFormData(prev => ({ ...prev, name }))}
                placeholder="John Smith"
              />
            </View>

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
                placeholder="Minimal 6 karakter"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Label>Confirm Password</Label>
              <TextField
                type="password"
                value={formData.confirmPassword}
                onChangeText={confirmPassword =>
                  setFormData(prev => ({ ...prev, confirmPassword }))
                }
                placeholder="Ulangi password"
              />
            </View>

            <Button
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.submitBtn}
            >
              <UserPlus size={18} color={theme.colors.white} style={styles.btnIcon} />
              <Text style={styles.submitBtnText}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Text>
            </Button>
          </View>

          <View style={styles.footerLink}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/login')}
              style={styles.linkText}
            >
              <Text style={styles.linkHighlight}>Sign in</Text>
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
    paddingTop: 24,
  },
  titleSection: {
    marginBottom: 20,
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
    gap: 14,
  },
  fieldGroup: {
    gap: 4,
  },
  submitBtn: {
    height: 52,
    marginTop: 10,
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
    marginTop: 28,
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