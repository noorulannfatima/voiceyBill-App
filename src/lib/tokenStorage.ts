import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// expo-secure-store is iOS/Android only (Keychain / EncryptedSharedPreferences).
// On web there is no native secure store, so fall back to AsyncStorage so
// `npm run web` keeps working in development. Production targets are mobile.
const REFRESH_TOKEN_KEY = 'voiceybill.refreshToken';

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

export async function getRefreshToken(): Promise<string | null> {
  if (isNative) {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  }
  return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function setRefreshToken(token: string | undefined | null): Promise<void> {
  // Defensive: a server build without the refresh-token feature won't include
  // this field in its response. Writing an empty / "undefined" string would
  // poison the secure store, so just skip — the user will be logged out on
  // the next 401 and re-authenticate, which is the safe fallback.
  if (!token) return;
  if (isNative) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    return;
  }
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export async function deleteRefreshToken(): Promise<void> {
  try {
    if (isNative) {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      return;
    }
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // Deleting a non-existent key shouldn't surface as an error to callers.
  }
}
