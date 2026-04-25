import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { usePathname, useRouter } from "expo-router";
import { type PropsWithChildren } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppFooter from "@/components/layout/app-footer";

const ROUTES_WITHOUT_SHELL = new Set(["/login", "/cadastro-usuario"]);
const DASHBOARD_ROUTES = new Set(["/", "/dashboard", "/index"]);

function AppHeader() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = DASHBOARD_ROUTES.has(pathname);

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <View style={styles.headerContent}>
        {isDashboard ? (
          <Text>
            <Text style={styles.logoBold}>Central</Text>
            <Text style={styles.logoAccent}>Pet</Text>
          </Text>
        ) : (
          <TouchableOpacity
            onPress={() => router.replace("/dashboard")}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.75}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={26} color="#1A1A1A" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.75}
        >
          <MaterialIcons name="notifications-none" size={26} color="#1A1A1A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const showShell = !ROUTES_WITHOUT_SHELL.has(pathname);

  return (
    <View style={styles.root}>
      {showShell ? <AppHeader /> : null}
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
  header: {
    paddingHorizontal: 24,
    paddingBottom: 14,
    backgroundColor: "#FAF7F5",
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDE8",
  },
  headerContent: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
  },
  logoBold: {
    fontFamily: "Lexend_700Bold",
    fontSize: 22,
    color: "#1A1A1A",
  },
  logoAccent: {
    fontFamily: "Lexend_700Bold",
    fontSize: 22,
    color: "#D97757",
  },
  content: {
    flex: 1,
  },
});