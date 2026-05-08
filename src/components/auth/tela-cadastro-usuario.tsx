import { useAutenticacao } from "@/context/contexto-autenticacao";
import { api } from "@/services/api";
import { exibirAlertaErroApi } from "@/utils/alerta-erro-api";
import {
    maskCPF,
    maskDate,
    maskPhone,
    validaCPF,
    validaData,
    validaTelefone,
} from "@/utils/validadores";
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
import { TextoTema as Text } from "../texto-tema";
import CampoEntrada from "./campo-entrada";
import CampoSenha from "./campo-senha";

interface SignupFormState {
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  senha: string;
  confirmarSenha: string;
}

export default function TelaCadastroUsuario() {
  const router = useRouter();
  const { signInWithToken } = useAutenticacao();
  const [loading, setLoading] = useState<boolean>(false);

  const [form, setForm] = useState<SignupFormState>({
    nome: "",
    cpf: "",
    dataNascimento: "",
    email: "",
    telefone: "",
    rua: "",
    numero: "",
    cidade: "",
    estado: "",
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
        rua: form.rua.trim() || undefined,
        numero: form.numero.trim() || undefined,
        cidade: form.cidade.trim() || undefined,
        estado: form.estado.trim() || undefined,
      });

      const loginResponse = await api.auth.login({ email: email.trim(), senha });
      const token = typeof loginResponse === "string" ? loginResponse : loginResponse.token;
      await signInWithToken(token, typeof loginResponse === "object" ? loginResponse : undefined);

      router.replace("/painel");
    } catch (error) {
      exibirAlertaErroApi("Falha no cadastro", error, "Nao foi possivel concluir o cadastro.");
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

        <CampoEntrada
          label="Nome"
          placeholder="Nome Completo"
          value={form.nome}
          onChangeText={(v) => handleChange("nome", v)}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <View style={styles.row}>
          <View style={styles.halfGroup}>
            <CampoEntrada
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
            <CampoEntrada
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

        <CampoEntrada
          label="E-mail"
          placeholder="exemplo@gmail.com"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          errorText={errors.email}
        />

        <CampoEntrada
          label="Telefone"
          placeholder="(00) 00000-0000"
          value={form.telefone}
          onChangeText={(v) => handleChange("telefone", v)}
          keyboardType="phone-pad"
          maxLength={15}
          returnKeyType="next"
          errorText={errors.telefone}
        />

        <View style={styles.row}>
          <View style={{ flex: 3 }}>
            <CampoEntrada
              label="Rua"
              placeholder="Nome da rua"
              value={form.rua}
              onChangeText={(v) => handleChange("rua", v)}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>
          <View style={{ flex: 1 }}>
            <CampoEntrada
              label="Número"
              placeholder="Nº"
              value={form.numero}
              onChangeText={(v) => handleChange("numero", v)}
              keyboardType="numeric"
              returnKeyType="next"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfGroup}>
            <CampoEntrada
              label="Cidade"
              placeholder="Cidade"
              value={form.cidade}
              onChangeText={(v) => handleChange("cidade", v)}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>
          <View style={styles.halfGroup}>
            <CampoEntrada
              label="Estado"
              placeholder="UF"
              value={form.estado}
              onChangeText={(v) => handleChange("estado", v)}
              autoCapitalize="characters"
              maxLength={2}
              returnKeyType="next"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfGroup}>
            <CampoSenha
              label="Senha"
              value={form.senha}
              onChangeText={(v) => handleChange("senha", v)}
              returnKeyType="next"
              errorText={errors.senha}
              disabled={loading}
            />
          </View>

          <View style={styles.halfGroup}>
            <CampoSenha
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
