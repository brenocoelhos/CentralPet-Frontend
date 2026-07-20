import { AppColors, Radius } from "@/constants/tema";
import {
  listarNotificacoes,
  marcarComoLida,
  marcarTodasComoLidas,
  type NotificacaoLocal,
} from "@/services/notificacoes/armazenamento-notificacoes";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

const ORANGE = AppColors.brand;

function formatarData(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "";

  const agora = new Date();
  const mesmoDia = data.toDateString() === agora.toDateString();

  if (mesmoDia) {
    return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

const ICONE_POR_TIPO: Record<string, keyof typeof Ionicons.glyphMap> = {
  pet_perdido: "paw",
  avistamento: "eye",
  outro: "notifications",
};

function CartaoNotificacao({
  item,
  onPress,
}: {
  item: NotificacaoLocal;
  onPress: (item: NotificacaoLocal) => void;
}) {
  return (
    <Pressable
      style={[styles.card, !item.lida && styles.cardNaoLida]}
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.titulo}${item.lida ? "" : ", não lida"}`}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name={ICONE_POR_TIPO[item.tipo ?? "outro"] ?? "notifications"}
          size={18}
          color={ORANGE}
        />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.titulo}
        </Text>
        {item.corpo ? (
          <Text style={styles.cardCorpo} numberOfLines={2}>
            {item.corpo}
          </Text>
        ) : null}
        <Text style={styles.cardData}>{formatarData(item.recebidoEm)}</Text>
      </View>
      {!item.lida ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}

export default function TelaNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<NotificacaoLocal[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  const carregar = useCallback(async (mostrarLoader = true) => {
    if (mostrarLoader) setCarregando(true);
    const lista = await listarNotificacoes();
    setNotificacoes(lista);
    setCarregando(false);
    setAtualizando(false);
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const handlePressItem = useCallback(async (item: NotificacaoLocal) => {
    if (!item.lida) {
      await marcarComoLida(item.id);
      setNotificacoes((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, lida: true } : n)),
      );
    }

    if (item.petId) {
      router.push(`/detalhe-pet?id=${encodeURIComponent(item.petId)}`);
    }
  }, []);

  const handleMarcarTodasLidas = useCallback(async () => {
    await marcarTodasComoLidas();
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
  }, []);

  const temNaoLidas = notificacoes.some((n) => !n.lida);

  return (
    <View style={styles.safe}>
      <FlatList
        data={notificacoes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CartaoNotificacao item={item} onPress={handlePressItem} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => {
              setAtualizando(true);
              void carregar(false);
            }}
            colors={[ORANGE]}
            tintColor={ORANGE}
          />
        }
        ListHeaderComponent={
          temNaoLidas ? (
            <Pressable
              style={styles.marcarTodasBtn}
              onPress={() => void handleMarcarTodasLidas()}
              accessibilityRole="button"
              accessibilityLabel="Marcar todas as notificações como lidas"
            >
              <Text style={styles.marcarTodasText}>Marcar todas como lidas</Text>
            </Pressable>
          ) : null
        }
        ListEmptyComponent={
          carregando ? null : (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-outline" size={44} color="#ccc" />
              <Text style={styles.emptyTitle}>Nenhuma notificação ainda</Text>
              <Text style={styles.emptyDesc}>
                Você vai ver aqui alertas de pets perdidos na sua região assim que
                chegarem.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.surface },
  listContent: { padding: 16, paddingBottom: 32, gap: 10, flexGrow: 1 },
  marcarTodasBtn: {
    alignSelf: "flex-end",
    marginBottom: 4,
  },
  marcarTodasText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 13,
    color: ORANGE,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 12,
    borderRadius: Radius.md,
    backgroundColor: AppColors.surfaceMuted,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  cardNaoLida: {
    borderColor: ORANGE,
    backgroundColor: "#FBEFE9",
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { flex: 1, gap: 2 },
  cardTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 14,
    color: "#1A1A1A",
  },
  cardCorpo: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#6F665A",
  },
  cardData: {
    fontFamily: "Lexend_400Regular",
    fontSize: 11,
    color: "#8E8476",
    marginTop: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
    marginTop: 6,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
    gap: 10,
  },
  emptyTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 15,
    color: "#555",
  },
  emptyDesc: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
  },
});
