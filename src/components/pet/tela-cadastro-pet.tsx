import { useAutenticacao } from "@/context/contexto-autenticacao";
import { criarApi } from "@/services/api";
import { exibirAlertaErroApi } from "@/utils/alerta-erro-api";
import { maskCEP, maskDate, maskPhone } from "@/utils/validadores";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from "react-native";
import { EntradaTextoTema } from "../entrada-texto-tema";
import { TextoTema } from "../texto-tema";
import type { PetDashboardDto } from "@/services/api/modules/pets.api";

// Lista rica para o autocomplete de espécies conhecidas
const ALL_SPECIES = [
  "Cachorro", "Gato", "Pássaro", "Coelho", "Cavalo", "Hamster", 
  "Porquinho da Índia", "Chinchila", "Furão (Ferret)", "Iguana", 
  "Cágado", "Jabuti", "Tartaruga", "Cobra", "Lagarto", "Peixe", 
  "Calopsita", "Papagaio", "Canário", "Periquito", "Caturrita"
];

const SIZE_OPTIONS = ["Pequeno", "Médio", "Grande"];

type PetPhoto = {
  uri: string;
  file?: Blob;
  isLocal?: boolean;
};

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
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.requiredMark}> *</Text>}
      </Text>
      <Pressable style={styles.select} onPress={() => setOpen(true)}>
        <Text style={styles.selectText}>{value}</Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        presentationStyle="overFullScreen"
        statusBarTranslucent
      >
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

function NotLoggedInGate() {
  const router = useRouter();
  return (
    <View style={styles.gateContainer}>
      <View style={styles.gateIconWrap}>
        <Ionicons name="lock-closed-outline" size={48} color="#D97757" />
      </View>
      <TextoTema style={styles.gateTitle}>Acesso restrito</TextoTema>
      <TextoTema style={styles.gateDescription}>
        Você precisa ter uma conta para cadastrar ou editar um pet desaparecido. Faça
        login ou crie sua conta para continuar.
      </TextoTema>
      <TouchableOpacity
        style={styles.gateButton}
        onPress={() => router.replace("/login")}
      >
        <Ionicons name="log-in-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <TextoTema style={styles.gateButtonText}>Entrar ou criar conta</TextoTema>
      </TouchableOpacity>
    </View>
  );
}

export default function TelaCadastroPet() {
  const router = useRouter();
  const { id, pet } = useLocalSearchParams<{ id?: string; pet?: string }>(); // Se houver 'id', vira tela de EDIÇÃO
  const isEditing = !!id;
  const petInicial = useMemo(() => parsePetParam(pet), [pet]);

  const { user, token } = useAutenticacao();

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [filteredSpecies, setFilteredSpecies] = useState<string[]>([]);
  const [showSpeciesSuggestions, setShowSpeciesSuggestions] = useState(false);
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("Médio");
  const [idade, setIdade] = useState("");
  const [cep, setCep] = useState("");
  const [disappearanceDate, setDisappearanceDate] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [descriptionChips, setDescriptionChips] = useState<string[]>([]);
  const [descriptionInput, setDescriptionInput] = useState("");
  const [phone, setPhone] = useState("");
  const [castrated, setCastrated] = useState(false);
  const [vaccinated, setVaccinated] = useState(false);
  const [hasReward, setHasReward] = useState(false);
  const [photos, setPhotos] = useState<PetPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCep, setFetchingCep] = useState(false);
  const [cepInvalido, setCepInvalido] = useState(false);
  const [cepError, setCepError] = useState("");
  const [dateError, setDateError] = useState("");

  const preencherDadosPet = (petData: PetDashboardDto) => {
    setName(petData.nome || "");
    setSpecies(petData.especie || "");
    setBreed(petData.raca || "");
    setColor(petData.cor || "");
    setSize(petData.porte === "Medio" ? "Médio" : petData.porte || "Médio");
    setIdade((petData as any).idade || "");
    setCep((petData as any).cep || "");
    setCepInvalido(false);
    setCepError("");
    setDateError("");
    setLocation(petData.localDesaparecimento || "");
    setDescriptionChips(petData.descricao || []);
    setPhone(maskPhone(petData.telefoneTutor || ""));
    setCastrated(!!petData.castrado);
    setVaccinated(!!petData.vacinado);
    setHasReward(!!petData.recompensa);

    if (petData.imagens && petData.imagens.length > 0) {
      setPhotos(petData.imagens.map((uri) => ({ uri })));
    } else if (petData.fotoUrl) {
      setPhotos([{ uri: petData.fotoUrl }]);
    }

    if (petData.dataDesaparecimento) {
      const parts = petData.dataDesaparecimento.split("T")[0].split("-");
      if (parts.length === 3) {
        setDisappearanceDate(`${parts[2]}/${parts[1]}/${parts[0]}`);
      }
    }
  };

  // Carregar dados iniciais em modo de edição
  useEffect(() => {
    if (isEditing && petInicial) {
      preencherDadosPet(petInicial);
      return;
    }

    if (isEditing && token && id) {
      const carregarDadosPet = async () => {
        try {
          setLoading(true);
          const apiClient = criarApi({ token });
          const petData = await apiClient.pets.buscarPetPorId(id);
          preencherDadosPet(petData);
        } catch (error) {
          Alert.alert("Erro", "Nao foi possivel carregar os dados do pet.");
          router.back();
        } finally {
          setLoading(false);
        }
      };
      carregarDadosPet();
    }
  }, [isEditing, id, token, petInicial]);
  if (!user) {
    return <NotLoggedInGate />;
  }

  // Manipular autocomplete da Espécie
  const handleSpeciesChange = (text: string) => {
    setSpecies(text);
    if (text.trim().length > 0) {
      const filtered = ALL_SPECIES.filter(s => 
        s.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSpecies(filtered);
      setShowSpeciesSuggestions(true);
    } else {
      setFilteredSpecies([]);
      setShowSpeciesSuggestions(false);
    }
  };

  // Buscar CEP → endereço (ViaCEP) + lat/lng (Google Geocoding)
  const handleCepChange = async (value: string) => {
    const masked = maskCEP(value);
    setCep(masked);
    setCepInvalido(false);
    setCepError("");

    const cleanCep = value.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      try {
        setFetchingCep(true);
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();

        if (!data.erro) {
          const enderecoFormatado = `${data.logradouro ? data.logradouro + ", " : ""}${data.bairro ? data.bairro + " - " : ""}${data.localidade}/${data.uf}`;
          setLocation(enderecoFormatado);

          try {
            const coords = await geocodificarEndereco(
              `${data.logradouro || ""} ${data.bairro || ""} ${data.localidade} ${data.uf} Brasil`.trim(),
            );
            if (coords) {
              setLatitude(coords.latitude);
              setLongitude(coords.longitude);
            }
          } catch (geoErr) {
            console.log("Erro ao geocodificar:", geoErr);
          }
        } else {
          setCepInvalido(true);
          setCepError("Informe um CEP valido.");
        }
      } catch (err) {
        setCepInvalido(true);
        setCepError("Nao foi possivel validar esse CEP.");
        console.log("Erro ao buscar ViaCEP:", err);
      } finally {
        setFetchingCep(false);
      }
    }
  };

  const pickPhoto = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissao necessaria", "Precisamos de acesso a sua galeria.");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 6,
    });

    if (!result.canceled) {
      setLoading(true);
      try {
        const processadas: PetPhoto[] = [];
        for (const asset of result.assets) {
          if (Platform.OS === "web") {
            processadas.push({
              uri: asset.uri,
              file: (asset as ImagePicker.ImagePickerAsset & { file?: Blob }).file,
              isLocal: true,
            });
            continue;
          }

          const manipResult = await ImageManipulator.manipulateAsync(
            asset.uri,
            [{ resize: { width: 1080 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
          );
          processadas.push({ uri: manipResult.uri, isLocal: true });
        }
        setPhotos((prev) => [...prev, ...processadas].slice(0, 6));
      } catch (error) {
        Alert.alert("Erro", "Nao foi possivel processar as imagens.");
      } finally {
        setLoading(false);
      }
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

  const validateCepField = () => {
    const cleanCep = cep.replace(/\D/g, "");
    if (!cep.trim()) {
      setCepError("");
      return true;
    }
    if (cleanCep.length !== 8 || cepInvalido) {
      setCepError("Informe um CEP valido.");
      return false;
    }
    setCepError("");
    return true;
  };

  const validateDisappearanceDateField = () => {
    if (!disappearanceDate.trim()) {
      setDateError("");
      return true;
    }
    if (!validaDataDesaparecimento(disappearanceDate)) {
      setDateError("Use uma data de hoje ou dos ultimos 5 anos.");
      return false;
    }
    setDateError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!token) {
      Alert.alert("Sessão expirada", "Entre novamente para continuar.");
      return;
    }
    if (photos.length < 1) {
      Alert.alert("Foto obrigatória", "Adicione pelo menos 1 foto do animal.");
      return;
    }
    // Removido !breed (Raça) da validação de obrigatoriedade
    if (!name || !species || !disappearanceDate || !location || !phone) {
      Alert.alert("Campos obrigatorios", "Preencha todos os campos obrigatorios marcados com *.");
      return;
    }
    if (!validateCepField()) {
      return;
    }
    if (!validateDisappearanceDateField()) {
      return;
    }
    try {
      setLoading(true);
      const apiClient = criarApi({ token });
      const me = await apiClient.auth.me();
      
      const usuarioId =
        (typeof me.usuarioId === "string" && me.usuarioId.trim()) ||
        (typeof me.id === "string" && me.id.trim()) ||
        (typeof me.uid === "string" && me.uid.trim()) ||
        user.uid;
      
      const tutorName = user.displayName?.trim() || user.email?.split("@")[0] || user.uid;

      const nowBrasilia = (() => {
        const b = new Date(Date.now() - 3 * 60 * 60 * 1000);
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${b.getUTCFullYear()}-${pad(b.getUTCMonth() + 1)}-${pad(b.getUTCDate())}T${pad(b.getUTCHours())}:${pad(b.getUTCMinutes())}:${pad(b.getUTCSeconds())}-03:00`;
      })();

      const payload: any = {
        usuarioId,
        nome: name.trim(),
        dataCadastro: nowBrasilia,
        especie: species.trim(),
        raca: breed.trim() || undefined,
        cor: color.trim() || undefined,
        porte: size === "Médio" ? "Medio" : size,
        dataDesaparecimento: toApiDate(disappearanceDate),
        localDesaparecimento: location.trim(),
        descricao: descriptionChips,
        nomeTutor: tutorName,
        telefoneTutor: phone.replace(/\D/g, ""),
        castrado: castrated,
        vacinado: vaccinated,
        recompensa: hasReward,
        idade: idade.trim() || undefined,
        cep: cep.replace(/\D/g, "") || undefined,
        latitude: latitude ?? undefined,
        longitude: longitude ?? undefined,
      };

      let petId = id || null;

      if (isEditing && id) {
        await apiClient.pets.atualizarPet(id, payload);
      } else {
        const cadastroResponse = await apiClient.pets.cadastroPet(payload);
        if (cadastroResponse && cadastroResponse.id) {
          petId = String(cadastroResponse.id);
        }
      }

      // Faz upload de novas fotos adicionadas locais (que começam com 'file://' ou 'ph://')
      if (petId) {
        const novasFotos = photos.filter((photo) =>
          photo.isLocal ||
          photo.uri.startsWith("file:") ||
          photo.uri.startsWith("ph:") ||
          photo.uri.startsWith("blob:") ||
          photo.uri.startsWith("data:")
        );
        for (let index = 0; index < novasFotos.length; index++) {
          const photo = novasFotos[index];
          const fileName = `foto-${Date.now()}-${index + 1}.jpeg`;
          try {
            await apiClient.pets.uploadImagem(petId, photo.uri, fileName, photo.file);
          } catch (uploadError) {
            console.log(`Upload da imagem ${index + 1} falhou.`);
          }
        }
      }

      Vibration.vibrate(20);
      Alert.alert(
        isEditing ? "Animal atualizado" : "Animal cadastrado", 
        isEditing ? "Alterações salvas com sucesso!" : "Cadastro realizado com sucesso!"
      );
      router.replace("/painel");
    } catch (error) {
      Vibration.vibrate([0, 40, 30, 40]);
      exibirAlertaErroApi(
        isEditing ? "Erro na atualização" : "Erro no cadastro",
        error,
        "Não foi possível processar a requisição."
      );
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
        {/* Fotos */}
        <View style={styles.photoSection}>
          <View style={styles.photoHeader}>
            <View style={styles.photoHeaderText}>
              <TextoTema style={styles.photoTitle}>
                Fotos do pet <TextoTema style={styles.requiredMark}>*</TextoTema>
              </TextoTema>
              <Text style={styles.photoSubtitle}>
                Escolha uma foto principal e adicione mais ângulos para facilitar a identificação.
              </Text>
            </View>

            <View style={styles.photoCounter}>
              <Ionicons name="images-outline" size={14} color="#D97757" />
              <Text style={styles.photoCounterText}>{photos.length}/6</Text>
            </View>
          </View>

          {photos[0] ? (
            <View style={styles.photoHero}>
              <Image source={{ uri: photos[0].uri }} style={styles.photoHeroImg} contentFit="cover" />
              <View style={styles.photoHeroOverlay}>
                <View style={styles.photoMainBadge}>
                  <Ionicons name="star" size={12} color="#FFFFFF" />
                  <Text style={styles.photoMainBadgeText}>Foto principal</Text>
                </View>
              </View>
              <Pressable
                style={styles.photoRemoveHero}
                onPress={() => removePhoto(0)}
                accessibilityRole="button"
                accessibilityLabel="Remover foto principal"
              >
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={styles.photoHeroEmpty}
              onPress={pickPhoto}
              accessibilityRole="button"
              accessibilityLabel="Adicionar fotos do pet"
            >
              <View style={styles.photoHeroIcon}>
                <Ionicons name="camera-outline" size={30} color="#D97757" />
              </View>
              <Text style={styles.photoHeroEmptyTitle}>Adicionar fotos</Text>
              <Text style={styles.photoHeroEmptyText}>Adicione pelo menos 1 foto para publicar</Text>
            </Pressable>
          )}

          <View style={styles.photoGrid}>
            {photos.slice(1).map((photo, i) => {
              const photoIndex = i + 1;
              return (
                <View key={`${photo.uri}-${photoIndex}`} style={styles.photoThumb}>
                  <Image source={{ uri: photo.uri }} style={styles.photoThumbImg} contentFit="cover" />
                  <Pressable
                    style={styles.photoRemove}
                    onPress={() => removePhoto(photoIndex)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remover foto ${photoIndex + 1}`}
                  >
                    <Ionicons name="close" size={14} color="#FFFFFF" />
                  </Pressable>
                </View>
              );
            })}

            {photos.length < 6 && (
              <Pressable
                style={styles.photoAdd}
                onPress={pickPhoto}
                accessibilityRole="button"
                accessibilityLabel="Adicionar mais fotos"
              >
                <Ionicons name="add" size={22} color="#D97757" />
                <Text style={styles.photoAddLabel}>Adicionar</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Linha 1: Nome e Espécie (Autocomplete) */}
        <View style={[styles.row, styles.rowAutocomplete]}>
          <View style={styles.half}>
            <TextoTema style={styles.label}>Nome <TextoTema style={styles.requiredMark}>*</TextoTema></TextoTema>
            <EntradaTextoTema
              placeholder="Ex: Rex"
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor="#B0A89A"
            />
          </View>

          <View style={[styles.half, { zIndex: 999 }]}>
            <TextoTema style={styles.label}>Espécie <TextoTema style={styles.requiredMark}>*</TextoTema></TextoTema>
            <EntradaTextoTema
              placeholder="Digite a espécie..."
              value={species}
              onChangeText={handleSpeciesChange}
              onFocus={() => species.length > 0 && setShowSpeciesSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSpeciesSuggestions(false), 150)}
              style={styles.input}
              placeholderTextColor="#B0A89A"
            />
            {showSpeciesSuggestions && filteredSpecies.length > 0 && (
              <View style={styles.autocompleteContainer}>
                {filteredSpecies.slice(0, 5).map((item) => (
                  <Pressable
                    key={item}
                    style={({ pressed }) => [
                      styles.autocompleteItem,
                      pressed && { backgroundColor: "#F5EDE6" },
                    ]}
                    onPress={() => {
                      setSpecies(item);
                      setShowSpeciesSuggestions(false);
                    }}
                  >
                    <Text style={styles.autocompleteText}>{item}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Linha 2: Raça (Opcional agora) e Cor */}
        <View style={styles.rowUnderAutocomplete}>
          <View style={styles.half}>
            <TextoTema style={styles.label}>Raça</TextoTema>
            <EntradaTextoTema
              placeholder="Ex: Vira-lata"
              value={breed}
              onChangeText={setBreed}
              style={styles.input}
              placeholderTextColor="#B0A89A"
            />
          </View>
          <View style={styles.half}>
            <TextoTema style={styles.label}>Cor</TextoTema>
            <EntradaTextoTema
              placeholder="Ex: Caramelo"
              value={color}
              onChangeText={setColor}
              style={styles.input}
              placeholderTextColor="#B0A89A"
            />
          </View>
        </View>

        {/* Linha 3: Porte e Idade */}
        <View style={styles.rowUnderAutocomplete}>
          <SelectField
            label="Porte"
            value={size}
            options={SIZE_OPTIONS}
            onChange={setSize}
          />
          <View style={styles.half}>
            <Text style={styles.label}>Idade Aproximada</Text>
            <EntradaTextoTema
              placeholder="Ex: 2 anos"
              value={idade}
              onChangeText={setIdade}
              style={styles.input}
              placeholderTextColor="#B0A89A"
            />
          </View>
        </View>

        {/* Linha 4: CEP e Data de Desaparecimento */}
        <View style={styles.rowUnderAutocomplete}>
          <View style={styles.half}>
            <TextoTema style={styles.label}>CEP</TextoTema>
            <View style={{ justifyContent: "center" }}>
              <EntradaTextoTema
                placeholder="00000-000"
                value={cep}
                onChangeText={handleCepChange}
                onBlur={validateCepField}
                style={styles.input}
                keyboardType="numeric"
                maxLength={9}
                placeholderTextColor="#B0A89A"
              />
              {fetchingCep && <ActivityIndicator size="small" color="#D4735A" style={styles.cepLoader} />}
            </View>
            {cepError ? <Text style={styles.fieldErrorText}>{cepError}</Text> : null}
          </View>
          <View style={styles.half}>
            <TextoTema style={styles.label}>Data Desaparecimento <TextoTema style={styles.requiredMark}>*</TextoTema></TextoTema>
            <EntradaTextoTema
              placeholder="dd/mm/aaaa"
              value={disappearanceDate}
              onChangeText={(value) => {
                setDisappearanceDate(maskDate(value));
                setDateError("");
              }}
              onBlur={validateDisappearanceDateField}
              style={styles.input}
              keyboardType="numeric"
              maxLength={10}
              placeholderTextColor="#B0A89A"
            />
            {dateError ? <Text style={styles.fieldErrorText}>{dateError}</Text> : null}
          </View>
        </View>

        {/* Checkboxes adicionais */}
        <View style={styles.checkboxRow}>
          <Pressable style={styles.checkboxItem} onPress={() => setCastrated((v) => !v)}>
            <View style={[styles.checkbox, castrated && styles.checkboxChecked]}>
              {castrated && <Ionicons name="checkmark" size={12} color="#FFF" />}
            </View>
            <TextoTema style={styles.checkboxLabel}>Castrado</TextoTema>
          </Pressable>

          <Pressable style={styles.checkboxItem} onPress={() => setVaccinated((v) => !v)}>
            <View style={[styles.checkbox, vaccinated && styles.checkboxChecked]}>
              {vaccinated && <Ionicons name="checkmark" size={12} color="#FFF" />}
            </View>
            <TextoTema style={styles.checkboxLabel}>Vacinado</TextoTema>
          </Pressable>

          <Pressable style={styles.checkboxItem} onPress={() => setHasReward((v) => !v)}>
            <View style={[styles.checkbox, hasReward && styles.checkboxChecked]}>
              {hasReward && <Ionicons name="checkmark" size={12} color="#FFF" />}
            </View>
            <TextoTema style={styles.checkboxLabel}>Tem recompensa</TextoTema>
          </Pressable>
        </View>

        {/* Endereço completo */}
        <View>
          <TextoTema style={styles.label}>Local do desaparecimento (Endereço/Bairro) <TextoTema style={styles.requiredMark}>*</TextoTema></TextoTema>
          <EntradaTextoTema
            placeholder="Ex: Bairro, Cidade ou preencha via CEP acima"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            placeholderTextColor="#B0A89A"
          />
          {latitude !== null && longitude !== null && (
            <Text style={styles.geoTagText}>
              📍 {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </Text>
          )}
        </View>

        {/* Descrições em Chips */}
        <View>
          <TextoTema style={styles.label}>Características / Descrição</TextoTema>
          <EntradaTextoTema
            placeholder="Digite marcas, coleira e aperte Concluído"
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
                <Pressable key={i} style={styles.chip} onPress={() => removeDescriptionChip(i)}>
                  <Text style={styles.chipText}>{chip}</Text>
                  <Text style={styles.chipRemove}>✕</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Telefone para Contato */}
        <View>
          <TextoTema style={styles.label}>Telefone de Contato <TextoTema style={styles.requiredMark}>*</TextoTema></TextoTema>
          <EntradaTextoTema
            placeholder="(00) 00000-0000"
            value={phone}
            onChangeText={(value) => setPhone(maskPhone(value))}
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={15}
            placeholderTextColor="#B0A89A"
          />
        </View>

        {/* Botão de Envio adaptativo */}
        <Pressable
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Processando..." : isEditing ? "Salvar Alterações" : "Cadastrar"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 16, paddingBottom: 40, gap: 14, overflow: "visible" },
  photoSection: {
    backgroundColor: "#F8F3ED",
    borderWidth: 1,
    borderColor: "#EAE0D3",
    borderRadius: 18,
    padding: 12,
    gap: 12,
  },
  photoHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  photoHeaderText: { flex: 1 },
  photoTitle: {
    fontSize: 15,
    color: "#2A241E",
    fontFamily: "Lexend_700Bold",
    marginBottom: 3,
  },
  photoSubtitle: {
    fontSize: 11,
    lineHeight: 16,
    color: "#8A7B6B",
    fontFamily: "Lexend_400Regular",
  },
  photoCounter: {
    minHeight: 30,
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9DDD0",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  photoCounterText: {
    fontSize: 12,
    color: "#5A4F44",
    fontFamily: "Lexend_700Bold",
  },
  photoHero: {
    height: 190,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#E8E0D6",
  },
  photoHeroImg: { width: "100%", height: "100%" },
  photoHeroOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.24)",
  },
  photoMainBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(217,119,87,0.94)",
  },
  photoMainBadgeText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontFamily: "Lexend_700Bold",
  },
  photoRemoveHero: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.46)",
    alignItems: "center",
    justifyContent: "center",
  },
  photoHeroEmpty: {
    minHeight: 176,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#D7C6B7",
    borderStyle: "dashed",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    gap: 7,
  },
  photoHeroIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FBECE5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  photoHeroEmptyTitle: {
    fontSize: 15,
    color: "#2A241E",
    fontFamily: "Lexend_700Bold",
  },
  photoHeroEmptyText: {
    fontSize: 11,
    color: "#8A7B6B",
    fontFamily: "Lexend_400Regular",
  },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  photoThumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#E8E0D6",
  },
  photoThumbImg: { width: "100%", height: "100%" },
  photoRemove: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.48)",
    alignItems: "center",
    justifyContent: "center",
  },
  photoAdd: {
    width: 72, height: 72, borderRadius: 12, borderWidth: 1.5,
    borderColor: "#D7C6B7", borderStyle: "dashed", backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center", gap: 3,
  },
  photoAddLabel: {
    fontSize: 10,
    color: "#8A7B6B",
    textAlign: "center",
    fontFamily: "Lexend_600SemiBold",
  },
  row: { flexDirection: "row", gap: 10, position: "relative", overflow: "visible" },
  rowAutocomplete: { zIndex: 50 },
  rowUnderAutocomplete: { flexDirection: "row", gap: 10, position: "relative", zIndex: 1 },
  half: { flex: 1, position: "relative", overflow: "visible" },
  label: { fontSize: 12, color: "#5A4F44", marginBottom: 4, fontWeight: "500" },
  requiredMark: { color: "#D94F4F", fontWeight: "600" },
  input: {
    borderWidth: 1, borderColor: "#DDD5CA", borderRadius: 10,
    paddingHorizontal: 12, height: 40, backgroundColor: "#FFFFFF",
    fontSize: 13, color: "#3D3228", textAlignVertical: "center",
  },
  fieldErrorText: {
    color: "#D94F4F",
    fontSize: 11,
    marginTop: 4,
    fontFamily: "Lexend_500Medium",
  },
  autocompleteContainer: {
    position: "absolute", top: 44, left: 0, right: 0,
    backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DDD5CA",
    borderRadius: 8, zIndex: 9999, elevation: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12, shadowRadius: 6,
  },
  autocompleteItem: {
    padding: 11, borderBottomWidth: 1, borderBottomColor: "#F5F2EC",
    backgroundColor: "#FFFFFF",
  },
  autocompleteText: { fontSize: 13, color: "#3D3228", fontFamily: "Lexend_400Regular" },
  geoTagText: { fontSize: 11, color: "#6B9E5E", marginTop: 4, fontFamily: "Lexend_400Regular" },
  cepLoader: { position: "absolute", right: 12, top: 10 },
  chipsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  chip: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#EDE5D8",
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, gap: 6,
  },
  chipText: { fontSize: 12, color: "#5A4F44" },
  chipRemove: { fontSize: 11, color: "#8A7B6B" },
  select: {
    borderWidth: 1, borderColor: "#DDD5CA", borderRadius: 10, paddingHorizontal: 12,
    height: 40, backgroundColor: "#FFFFFF", flexDirection: "row",
    justifyContent: "space-between", alignItems: "center",
  },
  selectText: { fontSize: 13, color: "#3D3228" },
  chevron: { fontSize: 14, color: "#8A7B6B" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.40)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 20000,
    elevation: 30,
  },
  modalBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    width: "84%",
    maxWidth: 320,
    overflow: "hidden",
    zIndex: 20001,
    elevation: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  modalOption: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EBE3",
    backgroundColor: "#FFFFFF",
  },
  modalOptionText: { fontSize: 14, color: "#3D3228", fontFamily: "Lexend_500Medium" },
  checkboxRow: { flexDirection: "row", flexWrap: "wrap", gap: 20, paddingLeft: 5 },
  checkboxItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5, borderWidth: 1.5,
    borderColor: "#C0B8AE", backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: "#D4735A", borderColor: "#D4735A" },
  checkboxLabel: { fontSize: 12, color: "#5A4F44", fontWeight: "500" },
  submitButton: { backgroundColor: "#D4735A", borderRadius: 30, paddingVertical: 15, alignItems: "center", marginTop: 6 },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },
  gateContainer: { flex: 1, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 16 },
  gateIconWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: "#FDF0EA", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  gateTitle: { fontSize: 20, fontWeight: "700", color: "#1A1A1A", textAlign: "center" },
  gateDescription: { fontSize: 14, color: "#8E8476", textAlign: "center", lineHeight: 21 },
  gateButton: {
    backgroundColor: "#D97757", borderRadius: 30, paddingVertical: 16, paddingHorizontal: 28,
    flexDirection: "row", alignItems: "center", marginTop: 8, elevation: 5,
    boxShadow: "0px 5px 10px rgba(217,119,87,0.35)",
  },
  gateButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});

function toApiDate(maskedDate: string) {
  const [day, month, year] = maskedDate.split("/");
  return `${year}-${month}-${day}`;
}

function parsePetParam(value?: string): PetDashboardDto | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(value)) as PetDashboardDto;
  } catch {
    return null;
  }
}

function validaDataDesaparecimento(dataStr: string): boolean {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataStr)) return false;

  const [dia, mes, ano] = dataStr.split("/").map(Number);
  const data = new Date(ano, mes - 1, dia);

  if (
    data.getFullYear() !== ano ||
    data.getMonth() !== mes - 1 ||
    data.getDate() !== dia
  ) {
    return false;
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  data.setHours(0, 0, 0, 0);

  const limiteAntigo = new Date(hoje);
  limiteAntigo.setFullYear(limiteAntigo.getFullYear() - 5);

  return data <= hoje && data >= limiteAntigo;
}

async function geocodificarEndereco(
  endereco: string,
): Promise<{ latitude: number; longitude: number } | null> {
  if (!endereco.trim()) {
    return null;
  }

  const geoKey = process.env.EXPO_PUBLIC_GOOGLE_GEOCODING_API_KEY;
  const geoQuery = encodeURIComponent(endereco);

  if (geoKey) {
    const geoResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${geoQuery}&key=${geoKey}`,
    );
    const geoData = await geoResponse.json();
    if (geoData.status === "OK" && geoData.results.length > 0) {
      const loc = geoData.results[0].geometry.location;
      return { latitude: loc.lat, longitude: loc.lng };
    }
  }

  const fallbackResponse = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${geoQuery}`,
  );
  const fallbackData = await fallbackResponse.json();
  const firstResult = Array.isArray(fallbackData) ? fallbackData[0] : null;

  if (!firstResult?.lat || !firstResult?.lon) {
    return null;
  }

  return {
    latitude: Number(firstResult.lat),
    longitude: Number(firstResult.lon),
  };
}
