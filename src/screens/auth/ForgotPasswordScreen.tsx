import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { useForgotPasswordMutation } from '../../features/auth/authAPI';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme/colors';
import Logo from '../../components/common/Logo';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const validate = () => {
    if (!email) { setEmailError('Email is required'); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Invalid email address'); return false; }
    setEmailError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await forgotPassword({ email }).unwrap();
      (navigation as any).navigate('VerifyResetOtp', { email });
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to send reset code. Please try again.');
    }
  };

  const styles = createStyles(themeColors);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} color={themeColors.foreground} />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.header}>
              <Logo size="lg" />
              <Text style={styles.title}>Forgot password</Text>
              <Text style={styles.subtitle}>
                Enter your email and we'll send a reset code.
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, emailError ? styles.inputError : null]}
                  placeholder="you@example.com"
                  placeholderTextColor={themeColors.mutedForeground}
                  value={email}
                  onChangeText={(v) => { setEmail(v); setEmailError(''); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                {!!emailError && <Text style={styles.error}>{emailError}</Text>}
              </View>

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading
                  ? <ActivityIndicator color={themeColors.primaryForeground} />
                  : <Text style={[styles.buttonText, { color: themeColors.primaryForeground }]}>Send reset code</Text>
                }
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkRow}
                onPress={() => (navigation as any).navigate('SignIn')}
              >
                <Text style={[styles.linkText, { color: themeColors.mutedForeground }]}>
                  Remember your password?{' '}
                  <Text style={{ color: themeColors.foreground, fontWeight: fontWeight.semibold, textDecorationLine: 'underline' }}>
                    Sign in
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof colors.light) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    scrollContent: { padding: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xxl },
    backBtn: { marginBottom: spacing.lg, alignSelf: 'flex-start', padding: spacing.xs },
    content: { maxWidth: 400, width: '100%', alignSelf: 'center' },
    header: { marginBottom: spacing.xl, alignItems: 'center', gap: spacing.sm },
    title: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.bold,
      color: theme.foreground,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
    subtitle: { fontSize: fontSize.sm, color: theme.mutedForeground, textAlign: 'center' },
    form: { gap: spacing.md },
    inputGroup: { gap: spacing.sm },
    label: { fontSize: fontSize.sm, color: theme.foreground, fontWeight: fontWeight.medium },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      fontSize: fontSize.md,
      color: theme.foreground,
      backgroundColor: theme.card,
    },
    inputError: { borderColor: theme.destructive },
    error: { fontSize: fontSize.xs, color: theme.destructive },
    button: {
      backgroundColor: theme.primary,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
    linkRow: { alignItems: 'center' },
    linkText: { fontSize: fontSize.sm, textAlign: 'center' },
  });
