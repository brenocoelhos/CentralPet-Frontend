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
    route: "/dashboard",
    icon: "home-outline",
    activeIcon: "home",
    matches: ["/", "/dashboard", "/index"],
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

export default function AppFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const handleNavigate = (route: string) => {
    if (pathname === route) return;
    router.replace(route as never);
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <View style={styles.nav}>
        {FOOTER_ITEMS.map((item) => {
          const active = item.matches.includes(pathname);
          const iconName = active && item.activeIcon ? item.activeIcon : item.icon;

          return (
            <TouchableOpacity
              key={item.route}
              activeOpacity={0.85}
              onPress={() => handleNavigate(item.route)}
              style={styles.item}
              accessibilityRole="button"
              accessibilityLabel={item.route}
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