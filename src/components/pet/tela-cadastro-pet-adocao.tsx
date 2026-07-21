import { AppColors, Radius, TouchTarget } from "@/constants/tema";
import { useAutenticacao } from "@/context/contexto-autenticacao";
import { adicionarPetAdocao, type PetAdocao } from "@/data/pets-adocao-mock";
import { maskPhone } from "@/utils/validadores";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { EntradaTextoTema } from "../entrada-texto-tema";

const ORANGE = AppColors.brand;

function NotLoggedInGate() {
  return (
    <View style={styles.gateContainer}>
      <View style={styles.gateIconWrap}>
        <Ionicons name="lock-closed-outline" size={48} color={ORANGE} />
      </View>
      <Text style={styles.gateTitle}>Acesso restrito</Text>
      <Text style={styles.gateDescription}>
        Você precisa ter uma conta para cadastrar um pet para adoção. Faça login
        ou crie sua conta para continuar.
      </Text>
      <TouchableOpacity
        style={styles.gateButton}
        onPress={() => router.replace("/login")}
        accessibilityRole="button"
        accessibilityLabel="Entrar ou criar conta"
      >
        <Ionicons
          name="log-in-outline"
          size={20}
          color="#FFFFFF"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.gateButtonText}>Entrar ou criar conta</Text>
      </TouchableOpacity>
    </View>
  );
}

function ToggleGroup<T extends string>({
  label,
  value,
  options,
  onChange,
  required,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  required?: boolean;
}) {
  return (
    <View style={styles.half}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.requiredMark}> *</Text>}
      </Text>
      <View style={styles.toggleRow}>
        {options.map((opt) => (
          <Pressable
            key={opt}
            style={[styles.toggleBtn, value === opt && styles.toggleBtnActive]}
            onPress={() => onChange(opt)}
            accessibilityRole="button"
            accessibilityLabel={`Selecionar ${opt}`}
          >
            <Text
              style={[
                styles.toggleBtnText,
                value === opt && styles.toggleBtnTextActive,
              ]}
            >
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function TelaCadastroPetAdocao() {
  const { user } = useAutenticacao();

  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState<"Cão" | "Gato">("Cão");
  const [raca, setRaca] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState<"Macho" | "Fêmea">("Macho");
  const [personalidade, setPersonalidade] = useState("");
  const [amigavelComCriancas, setAmigavelComCriancas] = useState(true);
  const [sobre, setSobre] = useState("");
  const [vacinado, setVacinado] = useState(false);
  const [castrado, setCastrado] = useState(false);
  const [vermifugado, setVermifugado] = useState(false);
  const [localizacao, setLocalizacao] = useState("");
  const [fotos, setFotos] = useState<string[]>([]);
  const [responsavelNome, setResponsavelNome] = useState("");
  const [responsavelCargo, setResponsavelCargo] = useState("");
  const [responsavelTelefone, setResponsavelTelefone] = useState("");
  const [salvando, setSalvando] = useState(false);

  if (!user) {
    return <NotLoggedInGate />;
  }

  const pickPhoto = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria.");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 4,
    });

    if (result.canceled) {
      return;
    }

    try {
      const processadas: string[] = [];
      for (const asset of result.assets) {
        if (Platform.OS === "web") {
          processadas.push(asset.uri);
          continue;
        }

        const manipResult = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 1080 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
        );
        processadas.push(manipResult.uri);
      }
      setFotos((prev) => [...prev, ...processadas].slice(0, 4));
    } catch {
      Alert.alert("Erro", "Não foi possível processar as imagens.");
    }
  };

  const removerFoto = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (fotos.length < 1) {
      Alert.alert("Foto obrigatória", "Adicione pelo menos 1 foto do animal.");
      return;
    }
    if (!nome.trim() || !sobre.trim() || !localizacao.trim() || !responsavelNome.trim() || !responsavelCargo.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha todos os campos obrigatórios marcados com *.",
      );
      return;
    }

    try {
      setSalvando(true);

      const novoPet: PetAdocao = {
        id: `local-${Date.now()}`,
        nome: nome.trim(),
        especie,
        raca: raca.trim() || "Sem raça definida",
        idade: idade.trim() || "Não informado",
        sexo,
        personalidade: personalidade.trim() || "Não informado",
        amigavelComCriancas,
        sobre: sobre.trim(),
        vacinado,
        castrado,
        vermifugado,
        localizacao: localizacao.trim(),
        fotos,
        responsavel: {
          nome: responsavelNome.trim(),
          cargo: responsavelCargo.trim(),
          telefone: responsavelTelefone.replace(/\D/g, "") || undefined,
        },
      };

      await adicionarPetAdocao(novoPet);

      Alert.alert("Pet cadastrado", "Seu pet já está disponível para adoção!");
      router.replace("/adocao");
    } catch {
      Alert.alert("Erro", "Não foi possível cadastrar o pet. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Fotos */}
        <View style={styles.photoSection}>
          <View style={styles.photoHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.photoTitle}>
                Fotos do pet <Text style={styles.requiredMark}>*</Text>
              </Text>
              <Text style={styles.photoSubtitle}>
                Fotos boas ajudam o pet a ser adotado mais rápido.
              </Text>
            </View>
            <View style={styles.photoCounter}>
              <Ionicons name="images-outline" size={14} color={ORANGE} />
              <Text style={styles.photoCounterText}>{fotos.length}/4</Text>
            </View>
          </View>

          {fotos[0] ? (
            <View style={styles.photoHero}>
              <Image source={{ uri: fotos[0] }} style={styles.photoHeroImg} contentFit="cover" />
              <Pressable
                style={styles.photoRemoveHero}
                onPress={() => removerFoto(0)}
                accessibilityRole="button"
                accessibilityLabel="Remover foto principal"
              >
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={styles.photoHeroEmpty}
              onPress={() => void pickPhoto()}
              accessibilityRole="button"
              accessibilityLabel="Adicionar fotos do pet"
            >
              <View style={styles.photoHeroIcon}>
                <Ionicons name="camera-outline" size={30} color={ORANGE} />
              </View>
              <Text style={styles.photoHeroEmptyTitle}>Adicionar fotos</Text>
              <Text style={styles.photoHeroEmptyText}>Adicione pelo menos 1 foto</Text>
            </Pressable>
          )}

          <View style={styles.photoGrid}>
            {fotos.slice(1).map((uri, i) => {
              const index = i + 1;
              return (
                <View key={`${uri}-${index}`} style={styles.photoThumb}>
                  <Image source={{ uri }} style={styles.photoThumbImg} contentFit="cover" />
                  <Pressable
                    style={styles.photoRemove}
                    onPress={() => removerFoto(index)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remover foto ${index + 1}`}
                  >
                    <Ionicons name="close" size={14} color="#FFFFFF" />
                  </Pressable>
                </View>
              );
            })}

            {fotos.length > 0 && fotos.length < 4 && (
              <Pressable
                style={styles.photoAdd}
                onPress={() => void pickPhoto()}
                accessibilityRole="button"
                accessibilityLabel="Adicionar mais fotos"
              >
                <Ionicons name="add" size={22} color={ORANGE} />
                <Text style={styles.photoAddLabel}>Adicionar</Text>
              </Pressable>
            )}
          </View>
        </View>

        <View>
          <Text style={styles.label}>
            Nome <Text style={styles.requiredMark}>*</Text>
          </Text>
          <EntradaTextoTema
            placeholder="Ex: Bento"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
            placeholderTextColor="#B0A89A"
          />
        </View>

        <View style={styles.row}>
          <ToggleGroup label="Espécie" value={especie} options={["Cão", "Gato"] as const} onChange={setEspecie} required />
          <ToggleGroup label="Sexo" value={sexo} options={["Macho", "Fêmea"] as const} onChange={setSexo} required />
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Raça</Text>
            <EntradaTextoTema
              placeholder="Ex: Golden Retriever"
              value={raca}
              onChangeText={setRaca}
              style={styles.input}
              placeholderTextColor="#B0A89A"
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Idade aproximada</Text>
            <EntradaTextoTema
              placeholder="Ex: 2 anos"
              value={idade}
              onChangeText={setIdade}
              style={styles.input}
              placeholderTextColor="#B0A89A"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Personalidade</Text>
            <EntradaTextoTema
              placeholder="Ex: Brincalhão"
              value={personalidade}
              onChangeText={setPersonalidade}
              style={styles.input}
              placeholderTextColor="#B0A89A"
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Localização *</Text>
            <EntradaTextoTema
              placeholder="Bairro, Cidade"
              value={localizacao}
              onChangeText={setLocalizacao}
              style={styles.input}
              placeholderTextColor="#B0A89A"
            />
          </View>
        </View>

        <View>
          <Text style={styles.label}>
            Sobre o pet <Text style={styles.requiredMark}>*</Text>
          </Text>
          <EntradaTextoTema
            placeholder="Conte um pouco sobre a história e o jeito do pet"
            value={sobre}
            onChangeText={setSobre}
            style={[styles.input, styles.textarea]}
            placeholderTextColor="#B0A89A"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.checkboxRow}>
          <Pressable
            style={styles.checkboxItem}
            onPress={() => setAmigavelComCriancas((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: amigavelComCriancas }}
          >
            <View style={[styles.checkbox, amigavelComCriancas && styles.checkboxChecked]}>
              {amigavelComCriancas && <Ionicons name="checkmark" size={12} color="#FFF" />}
            </View>
            <Text style={styles.checkboxLabel}>Amigável com crianças</Text>
          </Pressable>
        </View>

        <View>
          <Text style={styles.label}>Saúde</Text>
          <View style={styles.checkboxRow}>
            <Pressable
              style={styles.checkboxItem}
              onPress={() => setVacinado((v) => !v)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: vacinado }}
            >
              <View style={[styles.checkbox, vacinado && styles.checkboxChecked]}>
                {vacinado && <Ionicons name="checkmark" size={12} color="#FFF" />}
              </View>
              <Text style={styles.checkboxLabel}>Vacinado</Text>
            </Pressable>
            <Pressable
              style={styles.checkboxItem}
              onPress={() => setCastrado((v) => !v)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: castrado }}
            >
              <View style={[styles.checkbox, castrado && styles.checkboxChecked]}>
                {castrado && <Ionicons name="checkmark" size={12} color="#FFF" />}
              </View>
              <Text style={styles.checkboxLabel}>Castrado</Text>
            </Pressable>
            <Pressable
              style={styles.checkboxItem}
              onPress={() => setVermifugado((v) => !v)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: vermifugado }}
            >
              <View style={[styles.checkbox, vermifugado && styles.checkboxChecked]}>
                {vermifugado && <Ionicons name="checkmark" size={12} color="#FFF" />}
              </View>
              <Text style={styles.checkboxLabel}>Vermifugado</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>
              Responsável <Text style={styles.requiredMark}>*</Text>
            </Text>
            <EntradaTextoTema
              placeholder="Ex: Sarah Jenkins"
              value={responsavelNome}
              onChangeText={setResponsavelNome}
              style={styles.input}
              placeholderTextColor="#B0A89A"
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>
              Cargo/função <Text style={styles.requiredMark}>*</Text>
            </Text>
            <EntradaTextoTema
              placeholder="Ex: Gerente do Abrigo"
              value={responsavelCargo}
              onChangeText={setResponsavelCargo}
              style={styles.input}
              placeholderTextColor="#B0A89A"
            />
          </View>
        </View>

        <View>
          <Text style={styles.label}>Telefone do responsável (WhatsApp)</Text>
          <EntradaTextoTema
            placeholder="(00) 00000-0000"
            value={responsavelTelefone}
            onChangeText={(value) => setResponsavelTelefone(maskPhone(value))}
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={15}
            placeholderTextColor="#B0A89A"
          />
        </View>

        <Pressable
          style={[styles.submitButton, salvando && styles.submitButtonDisabled]}
          onPress={() => void handleSubmit()}
          disabled={salvando}
        >
          <Text style={styles.submitButtonText}>
            {salvando ? "Salvando..." : "Cadastrar para adoção"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: AppColors.surface },
  content: { padding: 16, paddingBottom: 40, gap: 14 },

  photoSection: {
    backgroundColor: AppColors.surfaceMuted,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: Radius.lg,
    padding: 12,
    gap: 12,
  },
  photoHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  photoTitle: { fontSize: 15, color: "#2A241E", fontFamily: "Lexend_700Bold", marginBottom: 3 },
  photoSubtitle: { fontSize: 11, lineHeight: 16, color: "#8A7B6B", fontFamily: "Lexend_400Regular" },
  photoCounter: {
    minHeight: 30, borderRadius: 15, paddingHorizontal: 10, backgroundColor: "#FFFFFF",
    borderWidth: 1, borderColor: "#E9DDD0", flexDirection: "row", alignItems: "center", gap: 5,
  },
  photoCounterText: { fontSize: 12, color: "#5A4F44", fontFamily: "Lexend_700Bold" },
  photoHero: { height: 190, borderRadius: 16, overflow: "hidden", backgroundColor: "#E8E0D6" },
  photoHeroImg: { width: "100%", height: "100%" },
  photoRemoveHero: {
    position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.46)", alignItems: "center", justifyContent: "center",
  },
  photoHeroEmpty: {
    minHeight: 176, borderRadius: 16, borderWidth: 1.5, borderColor: "#D7C6B7", borderStyle: "dashed",
    backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", paddingHorizontal: 18, gap: 7,
  },
  photoHeroIcon: { width: 58, height: 58, borderRadius: 29, backgroundColor: "#FBECE5", alignItems: "center", justifyContent: "center", marginBottom: 2 },
  photoHeroEmptyTitle: { fontSize: 15, color: "#2A241E", fontFamily: "Lexend_700Bold" },
  photoHeroEmptyText: { fontSize: 11, color: "#8A7B6B", fontFamily: "Lexend_400Regular" },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  photoThumb: { width: 72, height: 72, borderRadius: 12, overflow: "hidden", backgroundColor: "#E8E0D6" },
  photoThumbImg: { width: "100%", height: "100%" },
  photoRemove: {
    position: "absolute", top: 5, right: 5, width: 22, height: 22, borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.48)", alignItems: "center", justifyContent: "center",
  },
  photoAdd: {
    width: 72, height: 72, borderRadius: 12, borderWidth: 1.5, borderColor: "#D7C6B7",
    borderStyle: "dashed", backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", gap: 3,
  },
  photoAddLabel: { fontSize: 10, color: "#8A7B6B", textAlign: "center", fontFamily: "Lexend_600SemiBold" },

  row: { flexDirection: "row", gap: 10 },
  half: { flex: 1 },
  label: { fontSize: 12, color: "#5A4F44", marginBottom: 4, fontWeight: "500" },
  requiredMark: { color: "#D94F4F", fontWeight: "600" },
  input: {
    borderWidth: 1, borderColor: "#DDD5CA", borderRadius: 10, paddingHorizontal: 12,
    height: 40, backgroundColor: "#FFFFFF", fontSize: 13, color: "#3D3228",
  },
  textarea: { height: 92, paddingTop: 10, textAlignVertical: "top" },

  toggleRow: { flexDirection: "row", gap: 8 },
  toggleBtn: {
    flex: 1, minHeight: TouchTarget.min, borderRadius: Radius.pill, borderWidth: 1.5,
    borderColor: "#DDD5CA", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF",
  },
  toggleBtnActive: { backgroundColor: ORANGE, borderColor: ORANGE },
  toggleBtnText: { fontSize: 13, fontFamily: "Lexend_600SemiBold", color: "#5A4F44" },
  toggleBtnTextActive: { color: "#FFFFFF" },

  checkboxRow: { flexDirection: "row", flexWrap: "wrap", gap: 20, paddingLeft: 5 },
  checkboxItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: "#C0B8AE",
    backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: ORANGE, borderColor: ORANGE },
  checkboxLabel: { fontSize: 12, color: "#5A4F44", fontWeight: "500" },

  submitButton: { backgroundColor: ORANGE, borderRadius: Radius.pill, paddingVertical: 15, alignItems: "center", marginTop: 6 },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },

  gateContainer: { flex: 1, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 16 },
  gateIconWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: "#FDF0EA", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  gateTitle: { fontSize: 20, fontWeight: "700", color: "#1A1A1A", textAlign: "center" },
  gateDescription: { fontSize: 14, color: "#8E8476", textAlign: "center", lineHeight: 21 },
  gateButton: {
    backgroundColor: ORANGE, borderRadius: Radius.pill, paddingVertical: 16, paddingHorizontal: 28,
    flexDirection: "row", alignItems: "center", marginTop: 8, elevation: 5,
    boxShadow: "0px 5px 10px rgba(217,119,87,0.35)",
  },
  gateButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
