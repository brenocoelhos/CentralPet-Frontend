import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FooterItem = {
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon?: keyof typeof Ionicons.glyphMap;
  matches: string[];
};

const FOOTER_ITEMS: FooterItem[] = [
  {
    route: "/painel",
    icon: "home-outline",
    activeIcon: "home",
    matches: ["/", "/painel", "/index"],
  },
  {
    route: "/busca",
    icon: "search-outline",
    activeIcon: "search",
    matches: ["/busca"],
  },
  {
    route: "/cadastro-pet",
    icon: "add-outline",
    activeIcon: "add",
    matches: ["/cadastro-pet"],
  },
  {
    route: "/perfil",
    icon: "person-outline",
    activeIcon: "person",
    matches: ["/perfil"],
  },
];

const FOOTER_LABELS: Record<string, string> = {
  "/painel": "Ir para painel",
  "/busca": "Ir para busca",
  "/cadastro-pet": "Cadastrar pet",
  "/perfil": "Abrir perfil",
};

// Mantive o HOME_ROUTES caso você use para alguma outra validação futura,
// mas a navegação agora não precisa mais dessas verificações complexas.
const HOME_ROUTES = new Set(["/", "/painel", "/index"]);

export default function RodapeApp() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const handleNavigate = (route: string) => {
    // 1. Evita recarregar se já estiver na mesma aba
    if (pathname === route) return;

    // 2. Usa o navigate para aproveitar a tela que já está na memória
    router.navigate(route as never);
  };

  return (
    <View
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 14) }]}
    >
      <View style={styles.nav}>
        {FOOTER_ITEMS.map((item) => {
          const active = item.matches.includes(pathname);
          const iconName =
            active && item.activeIcon ? item.activeIcon : item.icon;

          return (
            <TouchableOpacity
              key={item.route}
              activeOpacity={0.85}
              onPress={() => handleNavigate(item.route)}
              style={styles.item}
              accessibilityRole="button"
              accessibilityLabel={FOOTER_LABELS[item.route] ?? "Navegar"}
            >
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={iconName}
                  size={item.route === "/cadastro-pet" ? 36 : 32}
                  color={active ? "#D97757" : "#7C7C7C"}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    borderTopColor: "#F0EDE8",
    backgroundColor: "#FFFFFF",
    paddingTop: 12,
    paddingHorizontal: 24,
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  item: {
    minWidth: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
