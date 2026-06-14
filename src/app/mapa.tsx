import { AppColors, Radius, TouchTarget } from "@/constants/tema";
import { useAutenticacao } from "@/context/contexto-autenticacao";
import type { PetDashboardDto } from "@/services/api/modules/pets.api";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

let MapView: any = View;
let Marker: any = () => null;

if (Platform.OS !== "web") {
  const maps = require("react-native-maps");
  MapView = maps.default;
  Marker = maps.Marker;
}

type Coords = { latitude: number; longitude: number };
type PetMarker = {
  id: string;
  name: string;
  address: string;
  coordinate: Coords;
  focused?: boolean;
};

const NEARBY_RADIUS_KM = 50;

type HugeIconElement = readonly [
  string,
  { readonly [key: string]: string | number },
];

const GOOGLE_MAPS_ICON: readonly HugeIconElement[] = [
  [
    "circle",
    { cx: "12", cy: "9", r: "2.5", stroke: "currentColor", strokeWidth: "1.5" },
  ],
  [
    "path",
    {
      d: "M9 17L18 6",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.5",
    },
  ],
  [
    "path",
    {
      d: "M6 12L14 2.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.5",
    },
  ],
  [
    "path",
    {
      d: "M7 5L10 7.5",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.5",
    },
  ],
  [
    "path",
    {
      d: "M12.0097 22C11.656 22 11.4911 21.8487 11.3085 21.341C10.8283 19.6517 9.93051 18.1911 8.84193 16.8195C7.85602 15.5031 6.40188 14.0036 5.64625 12.2964C3.54607 7.65487 6.8014 1.99238 11.9927 2.00003C17.3276 1.98532 20.5359 7.85105 18.2565 12.5446C17.5862 13.7271 16.8028 14.8433 15.917 15.878C14.5359 17.5095 13.2946 19.2753 12.7057 21.3436C12.5703 21.7426 12.3955 22 12.0097 22Z",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "1.5",
    },
  ],
];

const HUGE_ICON_COMPONENTS: Record<string, any> = {
  circle: Circle,
  path: Path,
};

function HugeIcon({
  icon,
  size,
  color,
}: {
  icon: readonly HugeIconElement[];
  size: number;
  color: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {icon.map(([tag, attrs], index) => {
        const Component = HUGE_ICON_COMPONENTS[tag.toLowerCase()];
        if (!Component) return null;

        return (
          <Component
            {...attrs}
            key={`${tag}-${index}`}
            stroke={attrs.stroke === "currentColor" ? color : attrs.stroke}
            fill={attrs.fill === "currentColor" ? color : attrs.fill}
          />
        );
      })}
    </Svg>
  );
}

export default function TelaMapa() {
  const { getApi } = useAutenticacao();
  const params = useLocalSearchParams<{
    nome?: string;
    endereco?: string;
    latitude?: string;
    longitude?: string;
  }>();

  const [coords, setCoords] = useState<Coords | null>(null);
  const [petMarkers, setPetMarkers] = useState<PetMarker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const focusedPet = useMemo(() => {
    const latitude = Number(params.latitude);
    const longitude = Number(params.longitude);
    const hasCoordinate = Number.isFinite(latitude) && Number.isFinite(longitude);

    if (!params.nome && !params.endereco && !hasCoordinate) {
      return null;
    }

    return {
      id: "focused-pet",
      name: params.nome || "Pet",
      address: params.endereco || "",
      coordinate: hasCoordinate ? { latitude, longitude } : null,
    };
  }, [params.endereco, params.latitude, params.longitude, params.nome]);

  const loadMap = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userCoords = await obterLocalizacaoAtual();
      setCoords(userCoords);

      const [pets, focusedCoordinate] = await Promise.all([
        getApi().pets.buscaPets(),
        focusedPet && !focusedPet.coordinate && focusedPet.address
          ? geocodificarEndereco(focusedPet.address)
          : Promise.resolve(focusedPet?.coordinate ?? null),
      ]);

      const markers = await criarMarcadoresPets(pets.content, userCoords);
      const allMarkers = [...markers];

      if (focusedPet && focusedCoordinate) {
        const focusedIndex = allMarkers.findIndex((marker) =>
          distanciaKm(marker.coordinate, focusedCoordinate) < 0.05
          && normalizar(marker.name) === normalizar(focusedPet.name),
        );

        if (focusedIndex >= 0) {
          allMarkers[focusedIndex] = {
            ...allMarkers[focusedIndex],
            focused: true,
          };
        } else {
          allMarkers.unshift({
            id: focusedPet.id,
            name: focusedPet.name,
            address: focusedPet.address,
            coordinate: focusedCoordinate,
            focused: true,
          });
        }
      }

      setPetMarkers(allMarkers);
    } catch {
      setError("Nao foi possivel carregar o mapa.");
    } finally {
      setLoading(false);
    }
  }, [focusedPet, getApi]);

  useEffect(() => {
    void loadMap();
  }, [loadMap]);

  const region = useMemo(() => {
    const target = petMarkers.find((marker) => marker.focused)?.coordinate ?? coords;
    if (!target) return undefined;
    return {
      ...target,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    };
  }, [coords, petMarkers]);

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
            <Text style={styles.homeButtonText}>Voltar</Text>
          </Pressable>
          <View style={styles.countPill}>
            <Text style={styles.countText}>
              {petMarkers.length} {petMarkers.length === 1 ? "pet" : "pets"}
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={styles.infoText}>Carregando mapa...</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              style={styles.retryButton}
              onPress={() => void loadMap()}
            >
              <Text style={styles.retryText}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : (
          <MapView
            style={styles.map}
            initialRegion={region}
            region={region}
            showsUserLocation
            showsMyLocationButton
          >
            {coords && <Marker coordinate={coords} title="Voce esta aqui" />}
            {petMarkers.map((pet) => (
              <Marker
                key={pet.id}
                coordinate={pet.coordinate}
                title={pet.name}
                description={pet.address}
              >
                <View style={[styles.petMarker, pet.focused && styles.petMarkerFocused]}>
                  <View style={styles.petMarkerIcon}>
                    <HugeIcon
                      icon={GOOGLE_MAPS_ICON}
                      size={20}
                      color={pet.focused ? AppColors.brand : "#D95F36"}
                    />
                  </View>
                  <Text style={styles.petMarkerText} numberOfLines={1}>
                    {pet.name}
                  </Text>
                </View>
              </Marker>
            ))}
          </MapView>
        )}
      </View>
    </SafeAreaView>
  );
}

async function obterLocalizacaoAtual(): Promise<Coords | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return null;
  }

  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
  };
}

async function criarMarcadoresPets(
  pets: PetDashboardDto[],
  userCoords: Coords | null,
): Promise<PetMarker[]> {
  const markers = await Promise.all(
    pets.map(async (pet) => {
      const coordinate =
        typeof pet.latitude === "number" && typeof pet.longitude === "number"
          ? { latitude: pet.latitude, longitude: pet.longitude }
          : await geocodificarEndereco(pet.localDesaparecimento);

      if (!coordinate) {
        return null;
      }

      if (userCoords && distanciaKm(userCoords, coordinate) > NEARBY_RADIUS_KM) {
        return null;
      }

      return {
        id: String(pet.id),
        name: pet.nome,
        address: pet.localDesaparecimento,
        coordinate,
      };
    }),
  );

  return markers.filter((marker): marker is PetMarker => !!marker);
}

async function geocodificarEndereco(endereco: string): Promise<Coords | null> {
  const cleanAddress = endereco.trim();
  if (!cleanAddress) {
    return null;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        `${cleanAddress} Brasil`,
      )}`,
    );
    const data = await response.json();
    const firstResult = Array.isArray(data) ? data[0] : null;

    if (!firstResult?.lat || !firstResult?.lon) {
      return null;
    }

    return {
      latitude: Number(firstResult.lat),
      longitude: Number(firstResult.lon),
    };
  } catch {
    return null;
  }
}

function distanciaKm(a: Coords, b: Coords) {
  const earthRadiusKm = 6371;
  const dLat = grausParaRad(b.latitude - a.latitude);
  const dLon = grausParaRad(b.longitude - a.longitude);
  const lat1 = grausParaRad(a.latitude);
  const lat2 = grausParaRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function grausParaRad(value: number) {
  return (value * Math.PI) / 180;
}

function normalizar(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.surface },
  container: { flex: 1 },
  header: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  homeButton: {
    minHeight: TouchTarget.min,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(0,0,0,0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  homeButtonText: { fontFamily: "Lexend_600SemiBold", color: "#fff" },
  countPill: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 12,
    color: "#2A241E",
  },
  map: { flex: 1 },
  petMarker: {
    maxWidth: 110,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0C9BA",
    alignItems: "center",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.16)",
    elevation: 3,
  },
  petMarkerFocused: {
    borderColor: AppColors.brand,
    borderWidth: 2,
  },
  petMarkerIcon: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  petMarkerText: {
    color: "#2A241E",
    fontFamily: "Lexend_700Bold",
    fontSize: 10,
    marginTop: -2,
  },
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
    borderRadius: Radius.pill,
    backgroundColor: AppColors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  retryText: { fontFamily: "Lexend_600SemiBold", color: "#fff" },
});
