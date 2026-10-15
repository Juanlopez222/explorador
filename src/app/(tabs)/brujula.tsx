import { Ionicons } from "@expo/vector-icons";
import { Magnetometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Card from "../../components/Card";
import { colors } from "../../theme";

const DIRS = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];

export default function Brujula() {
  const [grados, setGrados] = useState(0);
  const [disponible, setDisponible] = useState<boolean | null>(null);
  const filtro = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const subs: { remove: () => void }[] = [];
    Magnetometer.isAvailableAsync().then((ok) => {
      setDisponible(ok);
      if (!ok) return;
      Magnetometer.setUpdateInterval(Platform.OS === "android" ? 100 : 80);
      subs.push(
        Magnetometer.addListener(({ x, y }) => {
          // suavizado para evitar temblor
          filtro.current = {
            x: filtro.current.x * 0.8 + x * 0.2,
            y: filtro.current.y * 0.8 + y * 0.2,
          };
          const ang =
            (Math.atan2(-filtro.current.x, filtro.current.y) * 180) / Math.PI;
          setGrados((ang + 360) % 360);
        }),
      );
    });
    return () => subs.forEach((s) => s.remove());
  }, []);

  const cardinal = DIRS[Math.round(grados / 45) % 8];

  return (
    <View style={s.cont}>
      <Card style={s.card}>
        {disponible === false ? (
          <Text style={s.aviso}>
            Este dispositivo no tiene magnetómetro disponible.
          </Text>
        ) : (
          <>
            <Text style={s.grados}>
              {Math.round(grados)}° {cardinal}
            </Text>
            <View style={s.wrap}>
              <Ionicons
                name="caret-down"
                size={34}
                color={colors.danger}
                style={s.puntero}
              />
              <View
                style={[s.dial, { transform: [{ rotate: `${-grados}deg` }] }]}
              >
                <Text style={[s.pt, s.v, { top: 10, color: colors.danger }]}>
                  N
                </Text>
                <Text style={[s.pt, s.v, { bottom: 10 }]}>S</Text>
                <Text style={[s.pt, s.h, { left: 14 }]}>O</Text>
                <Text style={[s.pt, s.h, { right: 14 }]}>E</Text>
              </View>
            </View>
            <Text style={s.nota}>
              Mantén el teléfono horizontal y lejos de imanes.
            </Text>
          </>
        )}
      </Card>
    </View>
  );
}
const s = StyleSheet.create({
  cont: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  card: { alignItems: "center", paddingVertical: 24 },
  grados: { fontSize: 36, fontWeight: "800", color: colors.primaryDark },
  wrap: { alignItems: "center", marginTop: 10 },
  puntero: { marginBottom: -6, zIndex: 2 },
  dial: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 6,
    borderColor: colors.primary,
    backgroundColor: "#F0FDFA",
  },
  pt: {
    position: "absolute",
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  v: { left: 0, right: 0, textAlign: "center" },
  h: { top: "50%", marginTop: -14 },
  nota: { color: colors.muted, marginTop: 20, textAlign: "center" },
  aviso: { color: colors.danger, textAlign: "center" },
});
