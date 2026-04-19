import { usePathname, useRouter } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText as Text } from "../themed-text";

type FooterItem = {
  label: string;
  route: string;
};

const FOOTER_ITEMS: FooterItem[] = [
  { label: "Dashboard", route: "/dashboard" },
  { label: "Busca", route: "/busca" },
  { label: "Cadastro Pet", route: "/cadastro-pet" },
  { label: "Perfil", route: "/perfil" },
  { label: "Login", route: "/login" },
  { label: "Cadastro", route: "/cadastro-usuario" },
];

export default function AppFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const handleNavigate = (route: string) => {
    if (pathname === route) {
      return;
    }

    router.push(route as never);
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FOOTER_ITEMS.map((item) => {
          const active = pathname === item.route;

          return (
            <TouchableOpacity
              key={item.route}
              activeOpacity={0.85}
              onPress={() => handleNavigate(item.route)}
              style={[styles.item, active && styles.itemActive]}
            >
              <Text style={[styles.itemText, active && styles.itemTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    borderTopColor: "#F0EDE8",
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "#F5F1E8",
  },
  itemActive: {
    backgroundColor: "#D97757",
  },
  itemText: {
    color: "#1A1A1A",
    fontWeight: "600",
    fontSize: 13,
  },
  itemTextActive: {
    color: "#FFFFFF",
  },
});