import { StyleSheet, View, ViewProps } from 'react-native';
import { colors, shadow } from '../theme';

export default function Card({ style, ...rest }: ViewProps) {
  return <View style={[s.card, style]} {...rest} />;
}
const s = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 14, marginBottom: 14, ...shadow },
});