import { api } from "@/services/api";
import { showApiErrorAlert } from "@/utils/api-error-alert";
import {
  maskCPF,
  maskDate,
  maskPhone,
  validaCPF,
  validaData,
  validaTelefone,
} from "@/utils/validators";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ThemedText as Text } from "../themed-text";
import AuthInputField from "./auth-input-field";
import AuthPasswordField from "./auth-password-field";

interface SignupFormState {
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  endereco: string;
  senha: string;
  confirmarSenha: string;
}

export default function UserSignupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [form, setForm] = useState<SignupFormState>({
    nome: "",
    cpf: "",
    dataNascimento: "",
    email: "",
    telefone: "",
    endereco: "",
    senha: "",
    confirmarSenha: "",
  });

  const [errors, setErrors] = useState({
    cpf: "",
    dataNascimento: "",
    telefone: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const handleChange = (field: keyof SignupFormState, value: string) => {
    let formatted = value;

    if (field === "cpf") formatted = maskCPF(value);
    if (field === "dataNascimento") formatted = maskDate(value);
    if (field === "telefone") formatted = maskPhone(value);

    setForm((prev) => ({ ...prev, [field]: formatted }));

    setErrors((prev) => {
      const newErrors = { ...prev };

      if (field === "cpf") {
        newErrors.cpf =
          formatted.length === 14 && !validaCPF(formatted)
            ? "CPF inválido"
            : "";
      }

      if (field === "dataNascimento") {
        newErrors.dataNascimento =
          formatted.length === 10 && !validaData(formatted)
            ? "Data inválida"
            : "";
      }

      if (field === "telefone") {
        newErrors.telefone =
          formatted.length >= 14 && !validaTelefone(formatted)
            ? "Telefone inválido"
            : "";
      }

      if (field === "email") {
        newErrors.email = formatted.includes("@") ? "" : "Email inválido";
      }

      if (field === "confirmarSenha") {
        newErrors.confirmarSenha =
          formatted !== form.senha ? "As senhas não coincidem" : "";
      }

      if (field === "senha") {
        newErrors.senha =
          formatted.length > 0 && formatted.length < 6
            ? "Mínimo de 6 caracteres"
            : "";

        if (form.confirmarSenha) {
          newErrors.confirmarSenha =
            form.confirmarSenha !== formatted
              ? "As senhas não coincidem"
              : "";
        }
      }

      return newErrors;
    });
  };

  const handleCadastro = async () => {
    const {
      nome,
      email,
      senha,
      confirmarSenha,
      cpf,
      dataNascimento,
      telefone,
    } = form;

    if (
      !nome ||
      !email ||
      !senha ||
      !confirmarSenha ||
      !cpf ||
      !dataNascimento ||
      !telefone
    ) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    if (!validaCPF(cpf)) {
      Alert.alert("Erro no Formulário", "O CPF informado é inválido.");
      return;
    }

    if (!validaData(dataNascimento)) {
      Alert.alert(
        "Erro no Formulário",
        "A data de nascimento é inválida ou está no futuro."
      );
      return;
    }

    if (!validaTelefone(telefone)) {
      Alert.alert("Erro no Formulário", "O telefone informado é inválido.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Erro no Formulário", "O email informado é inválido.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    try {
      setLoading(true);

      await api.auth.cadastro({
        nome: nome.trim(),
        cpf: cpf.replace(/\D/g, ""),
        dataNascimento: toApiDate(dataNascimento),
        email: email.trim(),
        senha,
        telefone: telefone.replace(/\D/g, ""),
        endereco: form.endereco.trim() || undefined,
      });

      Alert.alert("Sucesso!", "Cadastro realizado com sucesso.");
      router.replace("/dashboard");
    } catch (error) {
      showApiErrorAlert("Falha no cadastro", error, "Nao foi possivel concluir o cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={95}
      >
        <View style={styles.avatarWrapper}>
          <TouchableOpacity style={styles.avatarCircle} activeOpacity={0.8}>
            <Ionicons name="camera-outline" size={32} color="rgba(0,0,0,0.5)" />
          </TouchableOpacity>
          <Text style={styles.avatarLabel}>Adicionar foto</Text>
        </View>

        <AuthInputField
          label="Nome"
          placeholder="Nome Completo"
          value={form.nome}
          onChangeText={(v) => handleChange("nome", v)}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <View style={styles.row}>
          <View style={styles.halfGroup}>
            <AuthInputField
              label="CPF"
              placeholder="000.000.000-00"
              value={form.cpf}
              onChangeText={(v) => handleChange("cpf", v)}
              keyboardType="numeric"
              maxLength={14}
              returnKeyType="next"
              errorText={errors.cpf}
            />
          </View>
          <View style={styles.halfGroup}>
            <AuthInputField
              label="Data do nascimento"
              placeholder="00/00/0000"
              value={form.dataNascimento}
              onChangeText={(v) => handleChange("dataNascimento", v)}
              keyboardType="numeric"
              maxLength={10}
              returnKeyType="next"
              errorText={errors.dataNascimento}
            />
          </View>
        </View>

        <AuthInputField
          label="E-mail"
          placeholder="exemplo@gmail.com"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          errorText={errors.email}
        />

        <AuthInputField
          label="Telefone"
          placeholder="(00) 00000-0000"
          value={form.telefone}
          onChangeText={(v) => handleChange("telefone", v)}
          keyboardType="phone-pad"
          maxLength={15}
          returnKeyType="next"
          errorText={errors.telefone}
        />

        <AuthInputField
          label="Endereco"
          placeholder="Rua, número, cidade"
          value={form.endereco}
          onChangeText={(v) => handleChange("endereco", v)}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <View style={styles.row}>
          <View style={styles.halfGroup}>
            <AuthPasswordField
              label="Senha"
              value={form.senha}
              onChangeText={(v) => handleChange("senha", v)}
              returnKeyType="next"
              errorText={errors.senha}
              disabled={loading}
            />
          </View>

          <View style={styles.halfGroup}>
            <AuthPasswordField
              label="Confirmar senha"
              value={form.confirmarSenha}
              onChangeText={(v) => handleChange("confirmarSenha", v)}
              returnKeyType="done"
              errorText={errors.confirmarSenha}
              disabled={loading}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleCadastro}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 48,
    justifyContent: "center",
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0EBE0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarLabel: {
    fontSize: 13,
    color: "#1A1A1A",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  halfGroup: {
    flex: 1,
    flexDirection: "column",
  },
  button: {
    backgroundColor: "#D97757",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

function toApiDate(maskedDate: string) {
  const [day, month, year] = maskedDate.split("/");
  return `${year}-${month}-${day}`;
}
