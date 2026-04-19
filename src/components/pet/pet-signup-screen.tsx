import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const SPECIES_OPTIONS = ["Cachorro", "Gato", "Pássaro", "Coelho", "Outro"];
const SIZE_OPTIONS = ["Pequeno", "Médio", "Grande"];

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.half}>
      <Text style={styles.label}>{label}</Text>
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
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("Cachorro");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("Médio");
  const [disappearanceDate, setDisappearanceDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name || !ownerName || !phone) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha ao menos Nome do pet, Seu nome e Telefone.",
      );
      return;
    }
    Alert.alert("Animal cadastrado", "Cadastro realizado com sucesso.");
    router.replace("/dashboard");
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
        {/* Foto */}
        <Pressable style={styles.photoBox}>
          <MaterialIcons name="add-a-photo" size={24} color="rgba(0,0,0,0.5)" />
          <Text style={styles.photoLabel}>Adicionar foto</Text>
        </Pressable>

        {/* Nome + Espécie */}
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Nome:</Text>
            <TextInput
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
          />
        </View>

        {/* Raça + Cor */}
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Raça</Text>
            <TextInput
              placeholder="Ex: Labrador"
              value={breed}
              onChangeText={setBreed}
              style={styles.input}
              placeholderTextColor="#B0A89A"
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Cor</Text>
            <TextInput
              placeholder="Ex: Caramelo"
              value={color}
              onChangeText={setColor}
              style={styles.input}
              placeholderTextColor="#B0A89A"
            />
          </View>
        </View>

        {/* Porte + Data do desaparecimento */}
        <View style={styles.row}>
          <SelectField
            label="Porte"
            value={size}
            options={SIZE_OPTIONS}
            onChange={setSize}
          />
          <View style={styles.half}>
            <Text style={styles.label}>Data do desaparecimento</Text>
            <TextInput
              placeholder="dd/mm/aaaa"
              value={disappearanceDate}
              onChangeText={setDisappearanceDate}
              style={styles.input}
              keyboardType="numbers-and-punctuation"
              placeholderTextColor="#B0A89A"
            />
          </View>
        </View>

        {/* Local */}
        <View>
          <Text style={styles.label}>Local do desaparecimento</Text>
          <TextInput
            placeholder="Bairro, cidade"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            placeholderTextColor="#B0A89A"
          />
        </View>

        {/* Descrição */}
        <View>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            placeholder="Adicione informações"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.textarea]}
            multiline
            numberOfLines={3}
            placeholderTextColor="#B0A89A"
          />
        </View>

        {/* Tags de características */}
        <View>
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, i) => (
                <Pressable
                  key={i}
                  style={styles.tag}
                  onPress={() => removeTag(i)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Seu nome + Telefone */}
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Seu nome</Text>
            <TextInput
              placeholder="Nome completo"
              value={ownerName}
              onChangeText={setOwnerName}
              style={styles.input}
              placeholderTextColor="#B0A89A"
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              placeholder="(00) 00000-0000"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              keyboardType="phone-pad"
              placeholderTextColor="#B0A89A"
            />
          </View>
        </View>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Cadastrar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 16, paddingBottom: 40, gap: 14 },

  photoBox: {
    alignSelf: "center",
    width: 130,
    height: 108,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#D4C9B8",
    borderStyle: "dashed",
    backgroundColor: "#F0E9DF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  cameraIcon: { fontSize: 28 },
  photoLabel: { fontSize: 12, color: "#8A7B6B", marginTop: 6 },

  row: { flexDirection: "row", gap: 10 },
  half: { flex: 1 },

  label: {
    fontSize: 12,
    color: "#5A4F44",
    marginBottom: 4,
    fontWeight: "500",
  },

  input: {
    borderWidth: 1,
    borderColor: "#DDD5CA",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: "#FFFFFF",
    fontSize: 13,
    color: "#3D3228",
  },
  textarea: {
    minHeight: 72,
    textAlignVertical: "top",
  },

  select: {
    borderWidth: 1,
    borderColor: "#DDD5CA",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
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

  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    backgroundColor: "#EDE5D8",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: { fontSize: 12, color: "#5A4F44" },

  submitButton: {
    backgroundColor: "#D4735A",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
