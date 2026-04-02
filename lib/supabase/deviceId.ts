import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';

const DEVICE_ID_KEY = 'birthcode_device_id';

export function createUuid(): string {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.getRandomValues) {
    throw new Error('Crypto API is unavailable. Cannot generate a secure device ID.');
  }

  const bytes = new Uint8Array(16);
  cryptoApi.getRandomValues(bytes);

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export async function getDeviceId(): Promise<string> {
  const existing = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (existing) {
    if (__DEV__) {
      console.log('[supabase][deviceId] using persisted device id');
    }
    return existing;
  }

  const deviceId = createUuid();
  await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
  if (__DEV__) {
    console.log('[supabase][deviceId] generated and persisted new device id');
  }
  return deviceId;
}
