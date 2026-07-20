import { type PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

// O rodapé flutuante (RodapeApp) já é renderizado uma única vez em
// LayoutComRodape (src/app/_layout.tsx), que envolve toda a Stack. Este
// componente cuida só do container de conteúdo de cada tela.
export default function EstruturaApp({ children }: PropsWithChildren) {
  return (
    <View style={styles.root}>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
});