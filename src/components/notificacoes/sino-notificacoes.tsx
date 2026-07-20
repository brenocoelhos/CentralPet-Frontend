import { useContagemNotificacoesNaoLidas } from "@/hooks/use-contagem-notificacoes";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type SinoNotificacoesProps = {
  style?: object;
  iconColor?: string;
};

export default function SinoNotificacoes({
  style,
  iconColor = "#1a1a1a",
}: SinoNotificacoesProps) {
  const naoLidas = useContagemNotificacoesNaoLidas();

  return (
    <TouchableOpacity
      style={[styles.notifBtn, style]}
      onPress={() => router.push("/notificacoes")}
      accessibilityRole="button"
      accessibilityLabel={
        naoLidas > 0
          ? `Notificações, ${naoLidas} não lidas`
          : "Notificações"
      }
    >
      <Ionicons name="notifications-outline" size={20} color={iconColor} />
      {naoLidas > 0 ? <View style={styles.dot} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0EDEA",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    top: 7,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D94F4F",
    borderWidth: 1.5,
    borderColor: "#F0EDEA",
  },
});
