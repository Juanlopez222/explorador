import { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Platform, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Boton from '../../components/Boton';
import Card from '../../components/Card';
import { Entrada, deleteEntrada, getEntradas } from '../../storage';
import { colors } from '../../theme';

export default function Inicio() {
  const [items, setItems] = useState<Entrada[]>([]);
  const cargar = useCallback(() => { getEntradas().then(setItems); }, []);
  useFocusEffect(cargar);

  const borrar = (id: string) =>
    Alert.alert('Eliminar', '¿Borrar esta entrada?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar', style: 'destructive', onPress: async () => { await deleteEntrada(id); cargar(); } },
    ]);

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      data={items}
      keyExtractor={(i) => i.id}
      contentContainerStyle={s.list}
      ListHeaderComponent={
        <Card style={s.hero}>
          <Text style={s.h1}>Mi diario de salidas</Text>
          <Text style={s.sub}>
            {items.length} lugares · {Platform.OS === 'ios' ? 'iOS' : 'Android'} {String(Platform.Version)}
          </Text>
        </Card>
      }
      ListEmptyComponent={
        <Text style={s.vacio}>Aún no hay entradas.{'\n'}Ve a la pestaña Cámara y guarda tu primera foto 📸</Text>
      }
      renderItem={({ item }) => (
        <Card>
          <Image source={{ uri: item.uri }} style={s.foto} />
          <Text style={s.titulo}>{item.titulo}</Text>
          <Text style={s.meta}>{item.fecha}</Text>
          {item.lat !== undefined && item.lon !== undefined && (
            <Text style={s.meta}>📍 {item.lat.toFixed(4)}, {item.lon.toFixed(4)}</Text>
          )}
          <Boton titulo="Eliminar" variante="peligro" onPress={() => borrar(item.id)} />
        </Card>
      )}
    />
  );
}
const s = StyleSheet.create({
  list: { padding: 16 },
  hero: { backgroundColor: colors.primaryDark },
  h1: { color: '#fff', fontSize: 22, fontWeight: '800' },
  sub: { color: '#99F6E4', marginTop: 4 },
  vacio: { textAlign: 'center', color: colors.muted, marginTop: 40, lineHeight: 22 },
  foto: { width: '100%', height: 190, borderRadius: 12, marginBottom: 10 },
  titulo: { fontSize: 17, fontWeight: '700', color: colors.text },
  meta: { color: colors.muted, marginTop: 2 },
});