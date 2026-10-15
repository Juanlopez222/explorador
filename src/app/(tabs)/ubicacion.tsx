import { useState } from 'react';
import { Linking, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import * as Location from 'expo-location';
import Boton from '../../components/Boton';
import Card from '../../components/Card';
import { colors } from '../../theme';

export default function Ubicacion() {
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(null);
  const [dir, setDir] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const actualizar = async () => {
    setCargando(true);
    setError('');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permiso de ubicación denegado. Actívalo en los ajustes del teléfono.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Platform.OS === 'android' ? Location.Accuracy.Balanced : Location.Accuracy.High,
      });
      setCoords(pos.coords);
      const [d] = await Location.reverseGeocodeAsync(pos.coords);
      setDir([d?.street, d?.district, d?.city, d?.region].filter(Boolean).join(', '));
    } catch {
      setError('No se pudo obtener la ubicación. ¿Está activado el GPS?');
    } finally {
      setCargando(false);
    }
  };

  const abrirMapa = () => {
    if (!coords) return;
    const { latitude: la, longitude: lo } = coords;
    const url = Platform.select({
      ios: `maps:0,0?q=${la},${lo}`,
      android: `geo:${la},${lo}?q=${la},${lo}`,
      default: `https://maps.google.com/?q=${la},${lo}`,
    }) as string;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={s.cont}>
      <Card>
        <Text style={s.titulo}>📍 Mi ubicación</Text>
        {coords ? (
          <>
            <Text style={s.dato}>Latitud: {coords.latitude.toFixed(5)}</Text>
            <Text style={s.dato}>Longitud: {coords.longitude.toFixed(5)}</Text>
            <Text style={s.dato}>Precisión: ±{Math.round(coords.accuracy ?? 0)} m</Text>
            {!!dir && <Text style={s.dir}>{dir}</Text>}
          </>
        ) : (
          <Text style={s.meta}>Pulsa el botón para obtener tu ubicación actual.</Text>
        )}
        {!!error && <Text style={s.error}>{error}</Text>}
        <Boton titulo={cargando ? 'Buscando…' : 'Actualizar ubicación'} onPress={actualizar} disabled={cargando} />
        {coords && <Boton titulo="Abrir en el mapa" variante="suave" onPress={abrirMapa} />}
      </Card>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  cont: { padding: 16 },
  titulo: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 8 },
  dato: { fontSize: 16, color: colors.text, marginTop: 3 },
  dir: { marginTop: 10, color: colors.primaryDark, fontWeight: '600' },
  meta: { color: colors.muted },
  error: { color: colors.danger, marginTop: 10 },
});