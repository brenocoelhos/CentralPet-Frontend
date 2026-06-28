import CartaoPet from "@/components/pet/cartao-pet";
import {
  CARD_GAP,
  CARD_HEIGHT,
  CARD_IMAGE_HEIGHT,
  CARD_WIDTH,
  HORIZONTAL_PADDING,
} from "@/constants/layout-grid";
import { PETS_ADOCAO, type PetAdocao } from "@/constants/pets-adocao";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ADOPTION_GREEN = "#3F8F7B";
const ADOPTION_SOFT = "#EFF7F3";
const BG = "#FBFAF7";

function PetAdoptionCard({ pet }: { pet: PetAdocao }) {
  return (
    <View style={styles.itemWrapper}>
      <CartaoPet
        variant="dashboard"
        name={pet.name}
        breed={`${pet.breed} - ${pet.age}`}
        location={`${pet.location} - ${pet.size}`}
        imageUrl={pet.photo}
        status="ADOÇÃO"
        imageHeight={CARD_IMAGE_HEIGHT}
        accentColor={ADOPTION_GREEN}
        cardStyle={styles.petCard}
        onPress={() =>
          router.push({
            pathname: "/detalhe-adocao",
            params: { id: pet.id },
          })
        }
        nameRightAccessory={
          <View style={styles.readyBadge}>
            <Ionicons name="heart" size={10} color={ADOPTION_GREEN} />
            <Text style={styles.readyBadgeText}>lar</Text>
          </View>
        }
      />
    </View>
  );
}

export default function TelaAdocao() {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "right", "left"]}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <FlatList
        data={PETS_ADOCAO}
        numColumns={2}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        columnWrapperStyle={styles.cardsRow}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{PETS_ADOCAO.length}</Text>
                <Text style={styles.summaryLabel}>disponiveis</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Ionicons name="shield-checkmark" size={19} color={ADOPTION_GREEN} />
                <Text style={styles.summaryLabel}>acompanhados</Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => <PetAdoptionCard pet={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 126,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 14,
  },
  summaryCard: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: ADOPTION_SOFT,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  summaryValue: {
    fontFamily: "Lexend_700Bold",
    fontSize: 21,
    color: ADOPTION_GREEN,
  },
  summaryLabel: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 12,
    color: "#607A70",
  },
  summaryDivider: {
    width: 1,
    height: 34,
    backgroundColor: "#CFE4DC",
  },
  cardsRow: {
    gap: CARD_GAP,
  },
  itemWrapper: {
    width: CARD_WIDTH,
  },
  petCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#F5F2EC",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0px 3px 8px rgba(0,0,0,0.08)",
    elevation: 3,
  },
  readyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: ADOPTION_SOFT,
  },
  readyBadgeText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 9,
    color: ADOPTION_GREEN,
  },
});
