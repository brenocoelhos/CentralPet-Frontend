import { StyleSheet, Text, View } from "react-native";

export default function MapView({ children, style, ...props }: any) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>Mapa não disponível na web</Text>
      {children}
    </View>
  );
}

export function Marker({ title }: any) {
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8e8e8",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#666",
    fontSize: 14,
  },
});
