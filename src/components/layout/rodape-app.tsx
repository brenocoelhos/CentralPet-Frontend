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
    route: "/home",
    icon: "home-outline",
    activeIcon: "home",
    matches: ["/home"],
  },
  {
    route: "/adocao",
    icon: "paw-outline",
    matches: ["/adocao"],
  },
  {
    route: "/novo",
    icon: "add-circle-outline",
    activeIcon: "add-circle",
    matches: ["/novo"],
  },
  {
    route: "/painel",
    icon: "location-outline",
    matches: ["/", "/painel", "/index"],
  },
  {
    route: "/perfil",
    icon: "person-outline",
    activeIcon: "person",
    matches: ["/perfil"],
  },
];

const FOOTER_LABELS: Record<string, string> = {
  "/home": "Ir para início",
  "/adocao": "Abrir adoção",
  "/novo": "Nova funcionalidade",
  "/painel": "Abrir mapa",
  "/perfil": "Abrir perfil",
};

export default function RodapeApp() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const handleNavigate = (route: string) => {
    if (pathname === route) return;
    router.navigate(route as never);
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          bottom: Math.max(insets.bottom, 16),
        },
      ]}
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
                  size={28}
                  color={active ? "#D97757" : "#7C7C7C"}
                />
                {active && <View style={styles.dot} />}
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
    position: "absolute",
    left: 24,
    right: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D97757",
  },
});
