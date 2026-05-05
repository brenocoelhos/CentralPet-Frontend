import { forwardRef } from "react";
import {
    StyleSheet,
    TextInput,
    type TextInputProps,
} from "react-native";

export type ThemedTextInputProps = TextInputProps;

export const EntradaTextoTema = forwardRef<TextInput, ThemedTextInputProps>(
  ({ style, ...rest }, ref) => {
    return <TextInput ref={ref} style={[styles.input, style]} {...rest} />;
  },
);

EntradaTextoTema.displayName = "EntradaTextoTema";

const styles = StyleSheet.create({
  input: {
    fontFamily: "Lexend_400Regular",
  },
});