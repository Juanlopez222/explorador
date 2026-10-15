import AsyncStorage from '@react-native-async-storage/async-storage';

export type Entrada = { id: string; uri: string; titulo: string; fecha: string; lat?: number; lon?: number };
const KEY = 'diario';

export async function getEntradas(): Promise<Entrada[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}
export async function addEntrada(e: Entrada) {
  const lista = await getEntradas();
  await AsyncStorage.setItem(KEY, JSON.stringify([e, ...lista]));
}
export async function deleteEntrada(id: string) {
  const lista = await getEntradas();
  await AsyncStorage.setItem(KEY, JSON.stringify(lista.filter((x) => x.id !== id)));
}