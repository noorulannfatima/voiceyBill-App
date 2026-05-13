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
import { ArrowLeft, RefreshCw } from 'lucide-react-native';
import { useForgotPasswordMutation } from '../../features/auth/authAPI';
import { useTheme } from '../../context/ThemeContext';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme/colors';
import OtpInput from '../../components/common/OtpInput';
import Logo from '../../components/common/Logo';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type VerifyResetOtpRouteProp = RouteProp<AuthStackParamList, 'VerifyResetOtp'>;

export default function VerifyResetOtpScreen() {
  const navigation = useNavigation();
  const route = useRoute<VerifyResetOtpRouteProp>();
  const email = route.params?.email ?? '';
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];

  const [otp, setOtp] = useState('');
  const [forgotPassword, { isLoading: isResending }] = useForgotPasswordMutation();

  const handleContinue = () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid code', 'Please enter the 6-digit reset code.');
      return;
    }
    (navigation as any).navigate('SetNewPassword', { email, otp });
  };

  const handleResend = async () => {
    try {
      await forgotPassword({ email }).unwrap();
      Alert.alert('Code sent', 'A new reset code has been sent to your email.');
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to resend code.');
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
              <Text style={styles.title}>Verify reset code</Text>
              <Text style={styles.subtitle}>
                Enter the 6-digit code sent to{'\n'}
                <Text style={{ color: themeColors.foreground, fontWeight: fontWeight.semibold }}>
                  {email}
                </Text>
              </Text>
            </View>

            <View style={styles.form}>
              <OtpInput value={otp} onChange={setOtp} />

              <TouchableOpacity
                style={[styles.button, otp.length !== 6 && styles.buttonDisabled]}
                onPress={handleContinue}
                disabled={otp.length !== 6}
              >
                <Text style={[styles.buttonText, { color: themeColors.primaryForeground }]}>Continue</Text>
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
  });
