import { useState } from 'react';
import {
  Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import Boton from '../../components/Boton';
import Card from '../../components/Card';
import { addEntrada } from '../../storage';
import { colors } from '../../theme';

export default function Camara() {
  const [uri, setUri] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [guardando, setGuardando] = useState(false);

  const tomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Activa el permiso de cámara en los ajustes del teléfono.');
      return;
    }
    const r = await ImagePicker.launchCameraAsync({
      quality: 0.6,
      allowsEditing: Platform.OS === 'ios', // el recorte nativo se comporta distinto en Android
      aspect: [4, 3],
    });
    if (!r.canceled) setUri(r.assets[0].uri);
  };

  const guardar = async () => {
    if (!uri) return;
    setGuardando(true);
    let lat: number | undefined;
    let lon: number | undefined;
    try {
      const p = await Location.requestForegroundPermissionsAsync();
      if (p.status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      }
    } catch {}
    await addEntrada({
      id: Date.now().toString(),
      uri,
      titulo: titulo.trim() || 'Sin título',
      fecha: new Date().toLocaleString('es-CO'),
      lat,
      lon,
    });
    setUri(null);
    setTitulo('');
    setGuardando(false);
    router.navigate('/');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={s.cont} keyboardShouldPersistTaps="handled">
        <Card>
          {uri ? <Image source={{ uri }} style={s.foto} /> : <Text style={s.vacio}>📷 Aún no hay foto</Text>}
          <Boton titulo={uri ? 'Tomar otra foto' : 'Tomar foto'} variante={uri ? 'suave' : 'primario'} onPress={tomarFoto} />
        </Card>
        {uri && (
          <Card>
            <Text style={s.label}>Título del lugar</Text>
            <TextInput style={s.input} value={titulo} onChangeText={setTitulo} placeholder="Ej: Parque Simón Bolívar" />
            <Boton titulo={guardando ? 'Guardando…' : 'Guardar en el diario'} onPress={guardar} disabled={guardando} />
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const s = StyleSheet.create({
  cont: { padding: 16 },
  foto: { width: '100%', height: 240, borderRadius: 12 },
  vacio: { textAlign: 'center', color: colors.muted, paddingVertical: 50, fontSize: 16 },
  label: { fontWeight: '700', color: colors.text, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 10, fontSize: 16 },
});