import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type PetCardVariant = "dashboard" | "search";

type PetCardProps = {
  variant: PetCardVariant;
  name: string;
  breed: string;
  location: string;
  imageUrl?: string;
  status?: "PERDIDO" | "ENCONTRADO";
  hasNewMessage?: boolean;
  onPress?: () => void;
  cardStyle?: object;
  imageHeight: number;
  accentColor?: string;
};

export default function PetCard({
  variant,
  name,
  breed,
  location,
  imageUrl,
  status,
  hasNewMessage,
  onPress,
  cardStyle,
  imageHeight,
  accentColor = "#D97757",
}: PetCardProps) {
  const isDashboard = variant === "dashboard";
  const statusColor = status === "ENCONTRADO" ? "#2E7D32" : accentColor;

  return (
    <TouchableOpacity
      style={[styles.cardBase, cardStyle]}
      activeOpacity={0.88}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.imageWrap, { height: imageHeight }]}> 
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="paw" size={36} color="#ccc" />
          </View>
        )}

        {isDashboard && status ? (
          <View style={[styles.badge, { backgroundColor: statusColor }]}>
            <Text style={styles.badgeText}>{status}</Text>
          </View>
        ) : null}

        {isDashboard && hasNewMessage ? (
          <View style={styles.chatDot}>
            <Ionicons name="chatbubble" size={11} color="#fff" />
          </View>
        ) : null}
      </View>

      <View style={styles.infoBox}>
        <Text
          style={[styles.name, isDashboard ? styles.nameDashboard : styles.nameSearch]}
          numberOfLines={1}
        >
          {name}
        </Text>

        <Text
          style={[styles.breed, isDashboard ? styles.breedDashboard : styles.breedSearch]}
          numberOfLines={1}
        >
          {breed}
        </Text>

        {isDashboard ? (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={11} color={accentColor} />
            <Text style={styles.locationDashboard} numberOfLines={1}>
              {location}
            </Text>
          </View>
        ) : (
          <Text style={styles.locationSearch} numberOfLines={2}>
            {location}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardBase: {
    overflow: "hidden",
  },
  imageWrap: {
    width: "100%",
    backgroundColor: "#E8E4DF",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 9,
    color: "#fff",
    letterSpacing: 0.3,
  },
  chatDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },
  infoBox: {
    padding: 10,
    gap: 2,
  },
  name: {
    color: "#1a1a1a",
  },
  nameDashboard: {
    fontFamily: "Lexend_700Bold",
    fontSize: 15,
  },
  nameSearch: {
    fontSize: 22,
    lineHeight: 26,
    fontFamily: "Lexend_600SemiBold",
    color: "#2A2621",
  },
  breed: {
    fontSize: 13,
  },
  breedDashboard: {
    fontFamily: "Lexend_400Regular",
    color: "#777",
    fontSize: 12,
  },
  breedSearch: {
    color: "#6F665A",
    fontFamily: "Lexend_500Medium",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  locationDashboard: {
    fontFamily: "Lexend_400Regular",
    fontSize: 11,
    color: "#999",
    flex: 1,
  },
  locationSearch: {
    fontSize: 11,
    color: "#7A7268",
    fontFamily: "Lexend_400Regular",
    minHeight: 30,
  },
});
