import { Ionicons } from "@expo/vector-icons";
import type React from "react";
import type { ComponentProps, ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { ThemedText as Text } from "../themed-text";
import { ThemedTextInput } from "../themed-text-input";

type InputProps = ComponentProps<typeof ThemedTextInput>;
type IconName = ComponentProps<typeof Ionicons>["name"];

type AuthInputFieldProps = Omit<InputProps, "style"> & {
  label?: string;
  errorText?: string;
  leftIconName?: IconName;
  rightAccessory?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  fieldStyle?: StyleProp<ViewStyle>;
};

export default function AuthInputField({
  label,
  errorText,
  leftIconName,
  rightAccessory,
  containerStyle,
  fieldStyle,
  ...inputProps
}: AuthInputFieldProps) {
  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.field, fieldStyle, !!errorText && styles.fieldError]}>
        {leftIconName ? (
          <Ionicons name={leftIconName} size={18} color="#8A816F" />
        ) : null}

        <ThemedTextInput
          {...inputProps}
          style={styles.input}
          placeholderTextColor={inputProps.placeholderTextColor ?? "#B0A898"}
        />

        {rightAccessory}
      </View>

      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    color: "#1A1A1A",
    marginBottom: 6,
    marginTop: 2,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0DBD0",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  fieldError: {
    borderColor: "red",
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: "#1A1A1A",
    borderWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 13,
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: 1,
    marginBottom: 8,
  },
});
