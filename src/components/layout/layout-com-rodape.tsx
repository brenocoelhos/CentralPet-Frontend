// components/layout/layout-com-rodape.tsx
import { usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";
import RodapeApp from "./rodape-app";

const TELAS_SEM_RODAPE = [
  "/login",
  "/cadastro-usuario",
  "/esqueci-senha",
  "/redefinir-senha",
  "/detalhe-pet-adocao",
];

export default function LayoutComRodape({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const mostrarRodape = !TELAS_SEM_RODAPE.includes(pathname);

  return (
    <View style={styles.container}>
      {children}
      {mostrarRodape && <RodapeApp />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
