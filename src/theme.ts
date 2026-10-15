import { Platform } from 'react-native';

export const colors = {
  primary: '#0F766E',
  primaryDark: '#115E59',
  bg: '#F1F5F4',
  card: '#FFFFFF',
  text: '#0F172A',
  muted: '#64748B',
  danger: '#DC2626',
};

// Validación de SO: sombra en iOS, elevation en Android
export const shadow = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  android: { elevation: 4 },
  default: {},
});