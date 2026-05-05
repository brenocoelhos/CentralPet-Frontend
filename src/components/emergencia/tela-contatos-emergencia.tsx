import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { TextoTema as Text } from "../texto-tema";

type Aba = "meus" | "regiao";

type Contato = {
  id: string;
  nome: string;
  categoria: string;
  telefone: string;
  endereco?: string;
  horario?: string;
  especialidade?: string;
  distanciaKm?: number;
  atendeEmergencia?: boolean;
  destaque?: string;
};

const meusContatosMock: Contato[] = [
  {
    id: "meu-1",
    nome: "Dra. Marina Lopes",
    categoria: "Veterinaria de confianca",
    telefone: "(11) 98888-4321",
    endereco: "Rua dos Pinheiros, 192 - Pinheiros",
    horario: "Seg-Sab 08:00 as 20:00",
    especialidade: "Clinica geral e felinos",
    atendeEmergencia: true,
    destaque: "WhatsApp ativo",
  },
  {
    id: "meu-3",
    nome: "Ana Pet Sitter",
    categoria: "Pet sitter",
    telefone: "(11) 96666-9999",
    endereco: "Atende na Zona Oeste",
    horario: "Plantao fim de semana",
    destaque: "Tutor secundario no app",
  },
];

const contatosRegiaoMock: Contato[] = [
  {
    id: "reg-1",
    nome: "Hospital Vet 24h Sao Lucas",
    categoria: "Hospital veterinario",
    telefone: "(11) 4002-1234",
    endereco: "Av. Paulista, 1400",
    horario: "24 horas",
    distanciaKm: 1.8,
    atendeEmergencia: true,
    destaque: "Atende trauma e cirurgia",
  },
  {
    id: "reg-2",
    nome: "Clinica Pata Feliz",
    categoria: "Clinica veterinaria",
    telefone: "(11) 3555-7788",
    endereco: "Rua Vergueiro, 980",
    horario: "Seg-Sex 09:00 as 19:00",
    distanciaKm: 2.6,
    atendeEmergencia: false,
    destaque: "Somente consulta",
  },
  {
    id: "reg-3",
    nome: "ONG Resgate 4 Patas",
    categoria: "ONG de resgate",
    telefone: "(11) 97770-0202",
    endereco: "Cobertura regional",
    horario: "Plantao por chamado",
    distanciaKm: 3.4,
    atendeEmergencia: true,
    destaque: "Apoio para animal ferido",
  },
  {
    id: "reg-4",
    nome: "CCZ Municipal",
    categoria: "Abrigo publico / zoonoses",
    telefone: "156",
    endereco: "Rua Municipal, 50",
    horario: "Seg-Sex 08:00 as 17:00",
    distanciaKm: 4.1,
    atendeEmergencia: true,
    destaque: "Servico publico",
  },
  {
    id: "reg-5",
    nome: "Corpo de Bombeiros",
    categoria: "Emergencia publica",
    telefone: "193",
    horario: "24 horas",
    distanciaKm: 0.9,
    atendeEmergencia: true,
    destaque: "Resgate em risco imediato",
  },
  {
    id: "reg-6",
    nome: "Farmacia Vet Manipulacao Alfa",
    categoria: "Farmacia veterinaria",
    telefone: "(11) 3444-8899",
    endereco: "Av. Brasil, 220",
    horario: "Seg-Sab 07:00 as 22:00",
    distanciaKm: 2.2,
    atendeEmergencia: false,
    destaque: "Medicamentos fora de linha",
  },
];

function CardContato({ item }: { item: Contato }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.nome}</Text>
        {typeof item.distanciaKm === "number" ? (
          <View style={styles.distanciaBadge}>
            <Ionicons name="location-outline" size={12} color="#8F4B36" />
            <Text style={styles.distanciaText}>{item.distanciaKm.toFixed(1)} km</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.cardCategoria}>{item.categoria}</Text>

      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={14} color="#8E8476" />
        <Text style={styles.infoText}>{item.telefone}</Text>
      </View>

      {item.endereco ? (
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color="#8E8476" />
          <Text style={styles.infoText}>{item.endereco}</Text>
        </View>
      ) : null}

      {item.horario ? (
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={14} color="#8E8476" />
          <Text style={styles.infoText}>{item.horario}</Text>
        </View>
      ) : null}

      {item.especialidade ? (
        <View style={styles.infoRow}>
          <Ionicons name="medkit-outline" size={14} color="#8E8476" />
          <Text style={styles.infoText}>{item.especialidade}</Text>
        </View>
      ) : null}

      <View style={styles.footerRow}>
        <View style={[
          styles.statusChip,
          item.atendeEmergencia ? styles.statusChipAtivo : styles.statusChipInativo,
        ]}>
          <Text style={styles.statusChipText}>
            {item.atendeEmergencia ? "Atende emergencia" : "Sem plantao"}
          </Text>
        </View>
        {item.destaque ? <Text style={styles.destaqueText}>{item.destaque}</Text> : null}
      </View>
    </View>
  );
}

export default function TelaContatosEmergencia() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>("meus");

  const listaAtual = useMemo(
    () => (abaAtiva === "meus" ? meusContatosMock : contatosRegiaoMock),
    [abaAtiva],
  );

  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Contatos de Emergencia</Text>
        <Text style={styles.heroSubtitle}>
          Organize contatos proprios e contatos da regiao para resposta rapida.
        </Text>
      </View>

      <View style={styles.abaContainer}>
        <Pressable
          style={[styles.abaButton, abaAtiva === "meus" && styles.abaButtonAtiva]}
          onPress={() => setAbaAtiva("meus")}
        >
          <Text style={[styles.abaText, abaAtiva === "meus" && styles.abaTextAtiva]}>Meus contatos</Text>
        </Pressable>
        <Pressable
          style={[styles.abaButton, abaAtiva === "regiao" && styles.abaButtonAtiva]}
          onPress={() => setAbaAtiva("regiao")}
        >
          <Text style={[styles.abaText, abaAtiva === "regiao" && styles.abaTextAtiva]}>Contatos da regiao</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.listaContainer} showsVerticalScrollIndicator={false}>
        {listaAtual.map((item) => (
          <CardContato key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFDF9",
  },
  hero: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: "#FFF3EC",
    borderBottomWidth: 1,
    borderBottomColor: "#F2DFD4",
  },
  heroTitle: {
    fontSize: 21,
    color: "#2D221A",
    fontWeight: "700",
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: "#7D6B5A",
  },
  abaContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  abaButton: {
    flex: 1,
    backgroundColor: "#F2ECE6",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5D9CE",
    paddingVertical: 10,
    alignItems: "center",
  },
  abaButtonAtiva: {
    backgroundColor: "#D97757",
    borderColor: "#D97757",
  },
  abaText: {
    fontSize: 13,
    color: "#6F6358",
    fontWeight: "600",
  },
  abaTextAtiva: {
    color: "#FFFFFF",
  },
  listaContainer: {
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EFE5DC",
    padding: 12,
    gap: 8,
    boxShadow: "0px 4px 10px rgba(0,0,0,0.06)",
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    color: "#2D221A",
    fontWeight: "700",
  },
  cardCategoria: {
    fontSize: 12,
    color: "#A06B54",
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#6F6358",
    lineHeight: 16,
  },
  footerRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  statusChip: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusChipAtivo: {
    backgroundColor: "#E6F7EC",
  },
  statusChipInativo: {
    backgroundColor: "#F2ECE6",
  },
  statusChipText: {
    fontSize: 11,
    color: "#466A4F",
    fontWeight: "600",
  },
  destaqueText: {
    fontSize: 11,
    color: "#8E8476",
    flex: 1,
    textAlign: "right",
  },
  distanciaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#FDEADE",
  },
  distanciaText: {
    fontSize: 11,
    color: "#8F4B36",
    fontWeight: "700",
  },
});
