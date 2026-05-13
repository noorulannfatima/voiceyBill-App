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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { useResetPasswordMutation } from '../../features/auth/authAPI';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme/colors';
import Logo from '../../components/common/Logo';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type SetNewPasswordRouteProp = RouteProp<AuthStackParamList, 'SetNewPassword'>;

export default function SetNewPasswordScreen() {
  const navigation = useNavigation();
  const route = useRoute<SetNewPasswordRouteProp>();
  const { email, otp } = route.params;
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = async () => {
    if (!validate()) return;
    try {
      await resetPassword({ email, otp, password }).unwrap();
      Alert.alert('Password reset', 'Your password has been reset successfully. Please sign in.', [
        { text: 'Sign in', onPress: () => (navigation as any).navigate('SignIn') },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to reset password. Please try again.');
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
              <Text style={styles.title}>Create new password</Text>
              <Text style={styles.subtitle}>Enter your new password below.</Text>
            </View>

            <View style={styles.form}>
              {/* New password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New password</Text>
                <View style={[styles.passwordWrap, errors.password ? styles.inputError : null]}>
                  <TextInput
                    style={[styles.passwordInput, { color: themeColors.foreground }]}
                    placeholder="Min. 6 characters"
                    placeholderTextColor={themeColors.mutedForeground}
                    value={password}
                    onChangeText={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    {showPassword
                      ? <EyeOff size={18} color={themeColors.mutedForeground} />
                      : <Eye size={18} color={themeColors.mutedForeground} />
                    }
                  </TouchableOpacity>
                </View>
                {!!errors.password && <Text style={styles.error}>{errors.password}</Text>}
              </View>

              {/* Confirm password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm password</Text>
                <View style={[styles.passwordWrap, errors.confirmPassword ? styles.inputError : null]}>
                  <TextInput
                    style={[styles.passwordInput, { color: themeColors.foreground }]}
                    placeholder="Re-enter your password"
                    placeholderTextColor={themeColors.mutedForeground}
                    value={confirmPassword}
                    onChangeText={(v) => { setConfirmPassword(v); setErrors((e) => ({ ...e, confirmPassword: undefined })); }}
                    secureTextEntry={!showConfirm}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirm(!showConfirm)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    {showConfirm
                      ? <EyeOff size={18} color={themeColors.mutedForeground} />
                      : <Eye size={18} color={themeColors.mutedForeground} />
                    }
                  </TouchableOpacity>
                </View>
                {!!errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
              </View>

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleReset}
                disabled={isLoading}
              >
                {isLoading
                  ? <ActivityIndicator color={themeColors.primaryForeground} />
                  : <Text style={[styles.buttonText, { color: themeColors.primaryForeground }]}>Reset password</Text>
                }
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
    passwordWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      backgroundColor: theme.card,
    },
    passwordInput: {
      flex: 1,
      paddingVertical: spacing.md,
      fontSize: fontSize.md,
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
  });
