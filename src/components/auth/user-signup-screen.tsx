import { useAuth } from "@/context/auth-context";
import { auth } from "@/lib/firebase";
import { getFirebaseAuthErrorMessage } from "@/utils/firebase-auth-errors";
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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
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
import { ThemedTextInput } from "../themed-text-input";

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
  const { hasFirebaseConfig, missingConfigKeys } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (!hasFirebaseConfig || !auth) {
      Alert.alert(
        "Firebase nao configurado",
        `Defina as variaveis ${missingConfigKeys.join(", ")} para habilitar o cadastro.`
      );
      return;
    }

    try {
      setLoading(true);

      const credentials = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        senha
      );

      await updateProfile(credentials.user, {
        displayName: nome.trim(),
      });

      Alert.alert("Sucesso!", "Cadastro realizado com sucesso.");
      router.replace("/dashboard");
    } catch (error) {
      Alert.alert("Falha no cadastro", getFirebaseAuthErrorMessage(error));
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

        <Text style={styles.label}>Nome:</Text>
        <ThemedTextInput
          style={styles.input}
          placeholder="Nome Completo"
          placeholderTextColor="#B0A898"
          value={form.nome}
          onChangeText={(v) => handleChange("nome", v)}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <View style={styles.row}>
          <View style={styles.halfGroup}>
            <Text style={styles.label}>CPF</Text>

            <ThemedTextInput
              style={[
                styles.input,
                errors.cpf ? { borderColor: "red" } : null
              ]}
              placeholder="000.000.000-00"
              placeholderTextColor="#B0A898"
              value={form.cpf}
              onChangeText={(v) => handleChange("cpf", v)}
              keyboardType="numeric"
              maxLength={14}
              returnKeyType="next"
            />

            {errors.cpf ? (
              <Text style={styles.errorText}>{errors.cpf}</Text>
            ) : null}
          </View>
          <View style={styles.halfGroup}>
            <Text style={styles.label}>Data do nascimento</Text>
            <ThemedTextInput
              style={[
                styles.input,
                errors.dataNascimento ? { borderColor: "red" } : null
              ]}
              placeholder="00/00/0000"
              placeholderTextColor="#B0A898"
              value={form.dataNascimento}
              onChangeText={(v) => handleChange("dataNascimento", v)}
              keyboardType="numeric"
              maxLength={10}
              returnKeyType="next"
            />
            {errors.dataNascimento ? (
              <Text style={styles.errorText}>{errors.dataNascimento}</Text>
            ) : null}
          </View>
        </View>

        <Text style={styles.label}>E-mail</Text>
        <ThemedTextInput
          style={[
            styles.input,
            errors.email ? { borderColor: "red" } : null
          ]}
          placeholder="exemplo@gmail.com"
          placeholderTextColor="#B0A898"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <Text style={styles.label}>Telefone</Text>
        <ThemedTextInput
          style={[
            styles.input,
            errors.telefone ? { borderColor: "red" } : null
          ]}
          placeholder="(00) 00000-0000"
          placeholderTextColor="#B0A898"
          value={form.telefone}
          onChangeText={(v) => handleChange("telefone", v)}
          keyboardType="phone-pad"
          maxLength={15}
          returnKeyType="next"
        />
        {errors.telefone ? (
          <Text style={styles.errorText}>{errors.telefone}</Text>
        ) : null}

        <Text style={styles.label}>Endereço</Text>
        <ThemedTextInput
          style={styles.input}
          placeholder="Rua, número, cidade"
          placeholderTextColor="#B0A898"
          value={form.endereco}
          onChangeText={(v) => handleChange("endereco", v)}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <View style={styles.row}>
          <View style={styles.halfGroup}>
            <Text style={styles.label}>Senha</Text>

            <View
              style={[
                styles.passwordInputWrapper,
                errors.senha ? { borderColor: "red" } : null
              ]}
            >
              <ThemedTextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor="#B0A898"
                value={form.senha}
                onChangeText={(v) => handleChange("senha", v)}
                secureTextEntry={!showPassword}
                returnKeyType="next"
              />

              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                activeOpacity={0.8}
                style={styles.passwordIconButton}
                disabled={loading}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#8A816F"
                />
              </TouchableOpacity>
            </View>

            {errors.senha ? (
              <Text style={styles.errorText}>{errors.senha}</Text>
            ) : null}
          </View>

          <View style={styles.halfGroup}>
            <Text style={styles.label}>Confirmar senha</Text>

            <View
              style={[
                styles.passwordInputWrapper,
                errors.confirmarSenha ? { borderColor: "red" } : null
              ]}
            >
              <ThemedTextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor="#B0A898"
                value={form.confirmarSenha}
                onChangeText={(v) => handleChange("confirmarSenha", v)}
                secureTextEntry={!showConfirmPassword}
                returnKeyType="done"
              />

              <TouchableOpacity
                onPress={() => setShowConfirmPassword((prev) => !prev)}
                activeOpacity={0.8}
                style={styles.passwordIconButton}
                disabled={loading}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#8A816F"
                />
              </TouchableOpacity>
            </View>

            {errors.confirmarSenha ? (
              <Text style={styles.errorText}>{errors.confirmarSenha}</Text>
            ) : null}
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
  label: {
    fontSize: 13,
    color: "#1A1A1A",
    marginBottom: 6,
    marginTop: 2,
  },
  input: {
    fontSize: 13,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#E0DBD0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  passwordInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0DBD0",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 13,
    color: "#1A1A1A",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 13,
    backgroundColor: "#FFFFFF",
    marginBottom: 0,
  },
  passwordIconButton: {
    paddingLeft: 8,
    paddingVertical: 4,
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

  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: 1,
    marginBottom: 8,
  },
});
