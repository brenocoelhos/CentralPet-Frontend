import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
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
    icon: "heart-outline",
    activeIcon: "heart-outline",
    matches: ["/adocao"],
  },
  {
    route: "/novo",
    icon: "add-circle-outline",
    activeIcon: "add-circle-outline",
    matches: ["/novo"],
  },
  {
    route: "/painel",
    icon: "location-outline",
    activeIcon: "location-outline",
    matches: ["/", "/painel", "/index"],
  },
  {
    route: "/perfil",
    icon: "person-outline",
    activeIcon: "person-outline",
    matches: ["/perfil"],
  },
];

const FOOTER_LABELS: Record<string, string> = {
  "/home": "Ir para início",
  "/adocao": "Abrir adoção",
  "/novo": "Cadastrar pet",
  "/painel": "Abrir alertas de pets perdidos",
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
      <View style={styles.glass}>
        <BlurView
          intensity={68}
          tint="light"
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.glassSheen} pointerEvents="none" />
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
                style={[styles.item, active && styles.itemActive]}
                accessibilityRole="button"
                accessibilityLabel={FOOTER_LABELS[item.route] ?? "Navegar"}
              >
                <View style={styles.iconWrapper}>
                  <Ionicons
                    name={iconName}
                    size={28}
                    color={active ? "#D97757" : "#3C3C3C"}
                  />
                  {active && <View style={styles.dot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 24,
    right: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  glass: {
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  glassSheen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    minHeight: 52,
    marginHorizontal: 2,
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  itemActive: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "transparent",
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
