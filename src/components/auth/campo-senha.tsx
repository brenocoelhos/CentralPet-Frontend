import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import CampoEntrada from "./campo-entrada";

type AuthPasswordFieldProps = {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  errorText?: string;
  disabled?: boolean;
  returnKeyType?: "next" | "done";
  leftIconName?: React.ComponentProps<typeof Ionicons>["name"];
};

export default function CampoSenha({
  label,
  value,
  onChangeText,
  placeholder = "••••••••",
  errorText,
  disabled,
  returnKeyType,
  leftIconName,
}: AuthPasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <CampoEntrada
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={!visible}
      errorText={errorText}
      disabled={disabled}
      returnKeyType={returnKeyType}
      leftIconName={leftIconName}
      rightAccessory={
        <TouchableOpacity
          onPress={() => setVisible((prev) => !prev)}
          activeOpacity={0.8}
          style={styles.iconButton}
          disabled={disabled}
        >
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={18}
            color="#8A816F"
          />
        </TouchableOpacity>
      }
    />
  );
}

const styles = StyleSheet.create({
  iconButton: {
    paddingLeft: 4,
    paddingVertical: 4,
  },
});
