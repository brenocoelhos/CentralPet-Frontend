import { AppColors, TouchTarget } from "@/constants/tema";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

type Coords = { latitude: number; longitude: number };

export default function TelaMapa() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadLocation() {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permissão de localização negada.");
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCoords({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    } catch {
      setError("Não foi possível obter sua localização.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLocation();
  }, []);

  const region = useMemo(() => {
    if (!coords) return undefined;
    return {
      ...coords,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }, [coords]);

  function voltarParaHome() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/painel");
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.homeButton} onPress={voltarParaHome}>
            <Text style={styles.homeButtonText}>Voltar para Home</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={styles.infoText}>Carregando localização...</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              style={styles.retryButton}
              onPress={() => void loadLocation()}
            >
              <Text style={styles.retryText}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : (
          <MapView
            style={styles.map}
            initialRegion={region}
            showsUserLocation
            showsMyLocationButton
          >
            {coords && <Marker coordinate={coords} title="Você está aqui" />}
          </MapView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.surface },
  container: { flex: 1 },
  header: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 2,
  },
  homeButton: {
    minHeight: TouchTarget.min,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  homeButtonText: { fontFamily: "Lexend_600SemiBold", color: "#fff" },
  map: { flex: 1 },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 16,
  },
  infoText: { fontFamily: "Lexend_500Medium", color: "#666" },
  errorText: {
    fontFamily: "Lexend_500Medium",
    color: "#D94F4F",
    textAlign: "center",
  },

  retryButton: {
    minHeight: TouchTarget.min,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: AppColors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  retryText: { fontFamily: "Lexend_600SemiBold", color: "#fff" },
});
