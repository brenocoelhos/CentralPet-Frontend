import { usePathname } from "expo-router";
import { type PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import AppFooter from "@/components/layout/app-footer";

const ROUTES_WITHOUT_SHELL = new Set(["/login", "/cadastro-usuario"]);

export default function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const showShell = !ROUTES_WITHOUT_SHELL.has(pathname);

  return (
    <View style={styles.root}>
      <View style={styles.content}>{children}</View>
      {showShell ? <AppFooter /> : null}
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