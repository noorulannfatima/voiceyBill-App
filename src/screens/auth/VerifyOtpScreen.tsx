import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RefreshCw, Mail } from 'lucide-react-native';
import { useVerifyOtpMutation, useResendOtpMutation } from '../../features/auth/authAPI';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../features/auth/authSlice';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme/colors';
import OtpInput from '../../components/common/OtpInput';
import Logo from '../../components/common/Logo';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type VerifyOtpRouteProp = RouteProp<AuthStackParamList, 'VerifyOtp'>;

export default function VerifyOtpScreen() {
  const navigation = useNavigation();
  const route = useRoute<VerifyOtpRouteProp>();
  const email = route.params?.email ?? '';
  const dispatch = useAppDispatch();
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];

  const [otp, setOtp] = useState('');
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid code', 'Please enter the 6-digit code from your email.');
      return;
    }
    try {
      const result = await verifyOtp({ email, otp }).unwrap();
      dispatch(setCredentials({
        user: result.data.user,
        accessToken: result.data.accessToken,
        reportSetting: result.data.reportSetting,
      }));
    } catch (error: any) {
      Alert.alert('Verification failed', error?.data?.message || 'Invalid or expired code. Please try again.');
    }
  };

  const handleResend = async () => {
    try {
      const result = await resendOtp({ email }).unwrap();
      Alert.alert('Code sent', result.message || 'A new verification code has been sent to your email.');
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to resend code. Please try again.');
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
          <View style={styles.content}>
            <View style={styles.header}>
              <Logo size="lg" />
              <View style={[styles.iconWrap, { backgroundColor: themeColors.muted }]}>
                <Mail size={28} color={themeColors.foreground} strokeWidth={1.5} />
              </View>
              <Text style={styles.title}>Verify your email</Text>
              <Text style={styles.subtitle}>
                Enter the 6-digit code sent to{'\n'}
                <Text style={{ color: themeColors.foreground, fontWeight: fontWeight.semibold }}>
                  {email}
                </Text>
              </Text>
            </View>

            <View style={styles.form}>
              <OtpInput value={otp} onChange={setOtp} disabled={isLoading} />

              <TouchableOpacity
                style={[styles.button, (isLoading || otp.length !== 6) && styles.buttonDisabled]}
                onPress={handleVerify}
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading
                  ? <ActivityIndicator color={themeColors.primaryForeground} />
                  : <Text style={[styles.buttonText, { color: themeColors.primaryForeground }]}>Verify email</Text>
                }
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.outlineButton, { borderColor: themeColors.border }]}
                onPress={handleResend}
                disabled={isResending}
              >
                {isResending
                  ? <ActivityIndicator size="small" color={themeColors.foreground} />
                  : <RefreshCw size={16} color={themeColors.foreground} />
                }
                <Text style={[styles.outlineButtonText, { color: themeColors.foreground }]}>
                  {isResending ? 'Sending...' : 'Resend code'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkRow}
                onPress={() => (navigation as any).navigate('SignIn')}
              >
                <Text style={[styles.linkText, { color: themeColors.mutedForeground }]}>
                  Already verified?{' '}
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
    scrollContent: { padding: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxl },
    content: { maxWidth: 400, width: '100%', alignSelf: 'center' },
    header: { marginBottom: spacing.xl, alignItems: 'center', gap: spacing.md },
    iconWrap: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.md,
    },
    title: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.bold,
      color: theme.foreground,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: fontSize.sm,
      color: theme.mutedForeground,
      textAlign: 'center',
      lineHeight: 22,
    },
    form: { gap: spacing.md },
    button: {
      backgroundColor: theme.primary,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    buttonDisabled: { opacity: 0.5 },
    buttonText: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
    outlineButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 1,
    },
    outlineButtonText: { fontSize: fontSize.md, fontWeight: fontWeight.medium },
    linkRow: { alignItems: 'center', marginTop: spacing.xs },
    linkText: { fontSize: fontSize.sm, textAlign: 'center' },
  });
