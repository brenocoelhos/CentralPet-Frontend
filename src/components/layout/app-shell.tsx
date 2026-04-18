import { type PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import AppFooter from "@/components/layout/app-footer";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <View style={styles.root}>
      <View style={styles.content}>{children}</View>
      <AppFooter />
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