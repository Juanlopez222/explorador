import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

type Props = { titulo: string; onPress: () => void; variante?: 'primario' | 'peligro' | 'suave'; disabled?: boolean };

export default function Boton({ titulo, onPress, variante = 'primario', disabled }: Props) {
  const bg = variante === 'peligro' ? colors.danger : variante === 'suave' ? '#CCFBF1' : colors.primary;
  const color = variante === 'suave' ? colors.primaryDark : '#fff';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [s.btn, { backgroundColor: bg, opacity: pressed || disabled ? 0.7 : 1 }]}>
      <Text style={[s.txt, { color }]}>{titulo}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  btn: { paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  txt: { fontWeight: '700', fontSize: 15 },
});