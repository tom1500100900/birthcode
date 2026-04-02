function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (!value) {
    return defaultValue;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

const useBackendEnv = process.env.EXPO_PUBLIC_USE_BACKEND;
const apiBaseUrlEnv = process.env.EXPO_PUBLIC_API_BASE_URL;

export const USE_BACKEND: boolean = parseBoolean(useBackendEnv, false);
export const API_BASE_URL: string = apiBaseUrlEnv?.trim() || 'http://localhost:8000';
