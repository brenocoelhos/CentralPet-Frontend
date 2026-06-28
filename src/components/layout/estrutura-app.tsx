import { type PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

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
