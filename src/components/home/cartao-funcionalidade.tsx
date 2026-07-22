import Ionicons from "@expo/vector-icons/Ionicons";
import {
    type ImageSourcePropType,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type CartaoFuncionalidadeProps = {
  title: string;
  description: string;
  image: ImageSourcePropType;
  buttonText: string;
  buttonColor: string;
  iconColor: string;
  iconBg: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  accessibilityLabel: string;
};

export function CartaoFuncionalidade({
  title,
  description,
  image,
  buttonText,
  buttonColor,
  iconColor,
  iconBg,
  icon,
  onPress,
  accessibilityLabel,
}: CartaoFuncionalidadeProps) {
  return (
    <ImageBackground
      source={image}
      imageStyle={styles.image}
      style={styles.card}
    >
      <View style={styles.overlay} />

      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={24} color={iconColor} />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 240,
    borderRadius: 24,
    overflow: "hidden",
    justifyContent: "center",
    marginBottom: 16,
    boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
    elevation: 3,
  },
  image: {
    borderRadius: 24,
    transform: [{ scale: 1.06 }, { translateX: -8 }],
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  content: {
    padding: 20,
    width: "62%",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontFamily: "Lexend_700Bold",
    fontSize: 22,
    color: "#1f1f1f",
  },
  description: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    lineHeight: 18,
    color: "#4A4540",
    marginTop: 6,
    marginBottom: 18,
  },
  button: {
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  buttonText: {
    fontFamily: "Lexend_700Bold",
    color: "#fff",
    fontSize: 13,
  },
});
