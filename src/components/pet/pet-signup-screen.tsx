import { useAuth } from "@/context/auth-context";
import { createApi } from "@/services/api";
import { showApiErrorAlert } from "@/utils/api-error-alert";
import { maskDate, maskPhone } from "@/utils/validators";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText as Text } from "../themed-text";
import { ThemedTextInput } from "../themed-text-input";

const SPECIES_OPTIONS = ["Cachorro", "Gato", "Pássaro", "Coelho", "Outro"];
const SIZE_OPTIONS = ["Pequeno", "Médio", "Grande"];

function SelectField({
  label,
  value,
  options,
  onChange,
  required,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.half}>
      <Text style={styles.label}>{label}{required && <Text style={styles.requiredMark}> *</Text>}</Text>
      <Pressable style={styles.select} onPress={() => setOpen(true)}>
        <Text style={styles.selectText}>{value}</Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <View style={styles.modalBox}>
            {options.map((opt) => (
              <Pressable
                key={opt}
                style={styles.modalOption}
                onPress={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                <Text style={styles.modalOptionText}>{opt}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export default function PetSignupScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("Cachorro");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("Médio");
  const [disappearanceDate, setDisappearanceDate] = useState("");
  const [location, setLocation] = useState("");
  const [descriptionChips, setDescriptionChips] = useState<string[]>([]);
  const [descriptionInput, setDescriptionInput] = useState("");
  const [phone, setPhone] = useState("");
  const [castrated, setCastrated] = useState(false);
  const [vaccinated, setVaccinated] = useState(false);
  const [hasReward, setHasReward] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria para adicionar fotos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 6,
    });
    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setPhotos((prev) => [...prev, ...uris].slice(0, 6));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const addDescriptionChip = () => {
    const trimmed = descriptionInput.trim();
    if (trimmed) {
      setDescriptionChips((prev) => [...prev, trimmed]);
      setDescriptionInput("");
    }
  };

  const removeDescriptionChip = (index: number) => {
    setDescriptionChips((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert(
        "Login obrigatório",
        "Você precisa estar logado para cadastrar um animal.",
        [{ text: "Ir para login", onPress: () => router.replace("/login") }],
      );
      return;
    }
    if (!token) {
      Alert.alert(
        "Sessao expirada",
        "Entre novamente para cadastrar um animal.",
        [{ text: "Ir para login", onPress: () => router.replace("/login") }],
      );
      return;
    }
    if (photos.length < 2) {
      Alert.alert(
        "Fotos obrigatórias",
        "Adicione pelo menos 2 fotos do animal.",
      );
      return;
    }
    if (!name || !breed || !disappearanceDate || !location || !phone) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha todos os campos obrigatórios marcados com *.",
      );
      return;
    }

    try {
      setLoading(true);
      const apiClient = createApi({ token });
      const me = await apiClient.auth.me();
      const usuarioId =
        (typeof me.usuarioId === "string" && me.usuarioId.trim()) ||
        (typeof me.id === "string" && me.id.trim()) ||
        (typeof me.uid === "string" && me.uid.trim()) ||
        user.uid;
      const tutorName = user.displayName?.trim() || user.email?.split("@")[0] || user.uid;

      await apiClient.pets.cadastroPet({
        usuarioId,
        nome: name.trim(),
        especie: species,
        raca: breed.trim() || undefined,
        cor: color.trim() || undefined,
        porte: size || undefined,
        dataDesaparecimento: toApiDate(disappearanceDate),
        localDesaparecimento: location.trim(),
        descricao: descriptionChips,
        castrado: castrated,
        vacinado: vaccinated,
        recompensa: hasReward,
        fotoUrl: photos[0],
        nomeTutor: tutorName,
        telefoneTutor: phone.replace(/\D/g, ""),
      });

      Alert.alert("Animal cadastrado", "Cadastro realizado com sucesso.");
      router.replace("/dashboard");
    } catch (error) {
      showApiErrorAlert("Erro no cadastro", error, "Nao foi possivel cadastrar o pet.");
    } finally {
      setLoading(false);
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
        <View>
          <Text style={styles.label}>Fotos ({photos.length}/6)</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photoCarousel}
          >
            {photos.map((uri, i) => (
              <View key={i} style={styles.photoThumb}>
                <Image source={{ uri }} style={styles.photoThumbImg} contentFit="cover" />
                <Pressable style={styles.photoRemove} onPress={() => removePhoto(i)}>
                  <Ionicons name="close-circle" size={20} color="#FFF" />
                </Pressable>
              </View>
            ))}
            {photos.length < 6 && (
              <Pressable style={styles.photoAdd} onPress={pickPhoto}>
                <Ionicons name="camera-outline" size={26} color="rgba(0,0,0,0.4)" />
                <Text style={styles.photoAddLabel}>
                  {photos.length === 0 ? "Adicionar fotos" : "Mais fotos"}
                </Text>
              </Pressable>
            )}
          </ScrollView>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Nome <Text style={styles.requiredMark}>*</Text></Text>
            <ThemedTextInput
              placeholder="Ex: Rex"
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor="#B0A89A"
            />
          </View>
          <SelectField
            label="Espécie"
            value={species}
            options={SPECIES_OPTIONS}
            onChange={setSpecies}
            required
          />
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Raça <Text style={styles.requiredMark}>*</Text></Text>
            <ThemedTextInput
              placeholder="Ex: Labrador"
              value={breed}
              onChangeText={setBreed}
              style={styles.input}
              placeholderTextColor="#B0A89A"
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Cor</Text>
            <ThemedTextInput
              placeholder="Ex: Caramelo"
              value={color}
              onChangeText={setColor}
              style={styles.input}
              placeholderTextColor="#B0A89A"
            />
          </View>
        </View>

        <View style={styles.row}>
          <SelectField
            label="Porte"
            value={size}
            options={SIZE_OPTIONS}
            onChange={setSize}
          />
          <View style={styles.half}>
            <Text style={styles.label}>Data do desaparecimento <Text style={styles.requiredMark}>*</Text></Text>
            <ThemedTextInput
              placeholder="dd/mm/aaaa"
              value={disappearanceDate}
              onChangeText={(value) => setDisappearanceDate(maskDate(value))}
              style={styles.input}
              keyboardType="numbers-and-punctuation"
              maxLength={10}
              placeholderTextColor="#B0A89A"
            />
          </View>
        </View>

        <View style={styles.checkboxRow}>
          <Pressable
            style={styles.checkboxItem}
            onPress={() => setCastrated((v) => !v)}
          >
            <View style={[styles.checkbox, castrated && styles.checkboxChecked]}>
              {castrated && <Ionicons name="checkmark" size={12} color="#FFF" />}
            </View>
            <Text style={styles.checkboxLabel}>Castrado</Text>
          </Pressable>

          <Pressable
            style={styles.checkboxItem}
            onPress={() => setVaccinated((v) => !v)}
          >
            <View style={[styles.checkbox, vaccinated && styles.checkboxChecked]}>
              {vaccinated && <Ionicons name="checkmark" size={12} color="#FFF" />}
            </View>
            <Text style={styles.checkboxLabel}>Vacinado</Text>
          </Pressable>

          <Pressable
            style={styles.checkboxItem}
            onPress={() => setHasReward((v) => !v)}
          >
            <View style={[styles.checkbox, hasReward && styles.checkboxChecked]}>
              {hasReward && <Ionicons name="checkmark" size={12} color="#FFF" />}
            </View>
            <Text style={styles.checkboxLabel}>Tem recompensa</Text>
          </Pressable>
        </View>


        <View>
          <Text style={styles.label}>Local do desaparecimento <Text style={styles.requiredMark}>*</Text></Text>
          <ThemedTextInput
            placeholder="Bairro, cidade"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            placeholderTextColor="#B0A89A"
          />
        </View>

        <View>
          <Text style={styles.label}>Descrição</Text>
          <ThemedTextInput
            placeholder="Digite e pressione Enter"
            value={descriptionInput}
            onChangeText={setDescriptionInput}
            onSubmitEditing={addDescriptionChip}
            blurOnSubmit={false}
            returnKeyType="done"
            style={styles.input}
            placeholderTextColor="#B0A89A"
          />
          {descriptionChips.length > 0 && (
            <View style={styles.chipsContainer}>
              {descriptionChips.map((chip, i) => (
                <Pressable
                  key={i}
                  style={styles.chip}
                  onPress={() => removeDescriptionChip(i)}
                >
                  <Text style={styles.chipText}>{chip}</Text>
                  <Text style={styles.chipRemove}>✕</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View>
          <Text style={styles.label}>Telefone <Text style={styles.requiredMark}>*</Text></Text>
          <ThemedTextInput
            placeholder="(00) 00000-0000"
            value={phone}
            onChangeText={(value) => setPhone(maskPhone(value))}
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={15}
            placeholderTextColor="#B0A89A"
          />
        </View>

        <Pressable
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>{loading ? "Enviando..." : "Cadastrar"}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 16, paddingBottom: 40, gap: 14 },

  photoCarousel: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 4,
  },
  photoThumb: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: "hidden",
  },
  photoThumbImg: {
    width: 90,
    height: 90,
  },
  photoRemove: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  photoAdd: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D4C9B8",
    borderStyle: "dashed",
    backgroundColor: "#F0E9DF",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  photoAddLabel: { fontSize: 11, color: "#8A7B6B", textAlign: "center" },

  row: { flexDirection: "row", gap: 10 },
  half: { flex: 1 },

  label: {
    fontSize: 12,
    color: "#5A4F44",
    marginBottom: 4,
    fontWeight: "500",
  },
  requiredMark: {
    color: "#D94F4F",
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#DDD5CA",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: "#FFFFFF",
    fontSize: 13,
    color: "#3D3228",
    textAlignVertical: "center",
  },

  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDE5D8",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 6,
  },
  chipText: { fontSize: 12, color: "#5A4F44" },
  chipRemove: { fontSize: 11, color: "#8A7B6B" },

  select: {
    borderWidth: 1,
    borderColor: "#DDD5CA",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: { fontSize: 13, color: "#3D3228" },
  chevron: { fontSize: 14, color: "#8A7B6B" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    width: 220,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  modalOption: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EBE3",
  },
  modalOptionText: { fontSize: 14, color: "#3D3228" },

  checkboxRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    paddingLeft: 5,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#C0B8AE",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#D4735A",
    borderColor: "#D4735A",
  },
  checkboxLabel: {
    fontSize: 12,
    color: "#5A4F44",
    fontWeight: "500",
  },  

  submitButton: {
    backgroundColor: "#D4735A",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 6,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

function toApiDate(maskedDate: string) {
  const [day, month, year] = maskedDate.split("/");
  return `${year}-${month}-${day}`;
}
