import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../lib/api";

const COLORS = {
  primary: "#16a34a",
  primaryDark: "#14532d",
  primaryLight: "#f0fdf4",
  text: "#1e293b",
  muted: "#64748b",
  danger: "#dc2626",
  white: "#ffffff",
  overlay: "rgba(255, 255, 255, 0.85)",
};

export default function Food() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [entry, setEntry] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const res = await api.get(`/api/food/history/${id}`);

        if (res.data.success) {
          setEntry(res.data.item);
        }
      } catch (err) {
        console.error("Failed to fetch food data", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10, color: COLORS.muted }}>
          Fetching Details...
        </Text>
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={styles.center}>
        <Text>Meal not found.</Text>
      </View>
    );
  }

  const n = entry.nutrition || {};
  const safety = entry.safetyCheck || {};
  const insights = entry.insights || {};
  const ingredients = entry.ingredients || [];

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />

      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=1964&auto=format&fit=crop",
        }}
        style={StyleSheet.absoluteFillObject}
        blurRadius={15}
      >
        <View style={styles.darkOverlay}>
          <SafeAreaView style={styles.safeArea}>
            
            {/* TOP NAV */}
            <View style={styles.navBar}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={COLORS.text}
                />
              </TouchableOpacity>

              <Text style={styles.navTitle}>Meal Details</Text>

              <View style={{ width: 40 }} />
            </View>

            <ScrollView
              contentContainerStyle={styles.container}
              showsVerticalScrollIndicator={false}
            >
              
              {/* IMAGE */}
              {entry.recognition?.annotatedImage ? (
                <Image
                  source={{ uri: entry.recognition.annotatedImage }}
                  style={styles.foodImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.foodImage, styles.imagePlaceholder]}>
                  <Ionicons
                    name="fast-food"
                    size={50}
                    color={COLORS.muted}
                  />
                </View>
              )}

              <View style={styles.card}>
                
                {/* HEADER */}
                <View style={styles.header}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>
                      {entry.recognition?.name || "Custom Meal"}
                    </Text>

                    <View style={styles.dateRow}>
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={COLORS.muted}
                      />

                      <Text style={styles.dateText}>
                        {entry.eatenAt
                          ? new Date(entry.eatenAt).toLocaleDateString(
                              undefined,
                              {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "Recent Meal"}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor:
                          safety.isSafe !== false
                            ? COLORS.primaryLight
                            : "#fee2e2",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          safety.isSafe !== false
                            ? COLORS.primary
                            : COLORS.danger,
                        fontWeight: "700",
                        fontSize: 12,
                      }}
                    >
                      {safety.isSafe !== false
                        ? "✓ SAFE"
                        : "⚠ CAUTION"}
                    </Text>
                  </View>
                </View>

                {/* NUTRITION */}
                <View style={styles.statsGrid}>
                  <StatBox
                    label="Calories"
                    value={`${Math.round(n.caloriesKcal || 0)}`}
                    unit="kcal"
                  />

                  <StatBox
                    label="Protein"
                    value={`${n.proteinG || 0}`}
                    unit="g"
                  />

                  <StatBox
                    label="Carbs"
                    value={`${n.carbsG || 0}`}
                    unit="g"
                  />

                  <StatBox
                    label="Sugar"
                    value={`${n.sugarG || 0}`}
                    unit="g"
                  />
                </View>

                {ingredients.length > 0 && (
                  <Section title="Items Selected" icon="restaurant">
                    <View style={styles.ingredientsContainer}>
                      {ingredients.map(
                        (ingredient: string, index: number) => (
                          <View
                            key={index}
                            style={styles.ingredientChip}
                          >
                            <Ionicons
                              name="nutrition"
                              size={14}
                              color={COLORS.primary}
                            />

                            <Text style={styles.ingredientText}>
                              {ingredient}
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  </Section>
                )}

                {/* MEAL BREAKDOWN */}
                {entry.selectedFoods &&
                  entry.selectedFoods.length > 0 && (
                    <Section
                      title="Meal Breakdown"
                      icon="list"
                    >
                      {entry.selectedFoods.map(
                        (item: any, index: number) => (
                          <View
                            key={index}
                            style={styles.foodItemRow}
                          >
                            <View style={styles.foodItemInfo}>
                              <Text style={styles.foodItemName}>
                                {item.name}
                              </Text>

                              <Text
                                style={styles.foodItemWeight}
                              >
                                {item.weight}g
                              </Text>
                            </View>

                            <View
                              style={styles.foodItemCalories}
                            >
                              <Text
                                style={styles.itemCalsText}
                              >
                                {Math.round(
                                  (item.nutrition
                                    ?.caloriesKcal || 0) *
                                    (item.weight / 100)
                                )}
                              </Text>

                              <Text
                                style={styles.itemCalsLabel}
                              >
                                {" "}
                                kcal
                              </Text>
                            </View>
                          </View>
                        )
                      )}
                    </Section>
                  )}

                {/* BENEFITS */}
                {insights.benefits &&
                  insights.benefits.length > 0 && (
                    <Section
                      title="Health Benefits"
                      icon="leaf"
                    >
                      {insights.benefits.map(
                        (b: string, i: number) => (
                          <View
                            key={i}
                            style={styles.bulletRow}
                          >
                            <Ionicons
                              name="checkmark-circle"
                              size={18}
                              color={COLORS.primary}
                            />

                            <Text style={styles.bulletText}>
                              {b}
                            </Text>
                          </View>
                        )
                      )}
                    </Section>
                  )}

                {/* SAFETY */}
                {safety.allergensMatched?.length ||
                safety.warnings?.length ? (
                  <Section
                    title="Safety & Allergens"
                    color={COLORS.danger}
                    icon="alert-circle"
                  >
                    {safety.allergensMatched?.map(
                      (a: string, i: number) => (
                        <Text
                          key={i}
                          style={styles.warningText}
                        >
                          • Contains: {a}
                        </Text>
                      )
                    )}

                    {safety.warnings?.map(
                      (w: string, i: number) => (
                        <Text
                          key={i}
                          style={styles.warningText}
                        >
                          • {w}
                        </Text>
                      )
                    )}
                  </Section>
                ) : (
                  <View style={styles.safeContainer}>
                    <Ionicons
                      name="shield-checkmark"
                      size={16}
                      color={COLORS.primary}
                    />

                    <Text style={styles.safeNote}>
                      No personal allergens detected.
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}

const StatBox = ({ label, value, unit }: any) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>

    <Text style={styles.statLabel}>{unit}</Text>

    <View style={styles.statUnderline} />

    <Text style={styles.statName}>{label}</Text>
  </View>
);

const Section = ({
  title,
  children,
  color = COLORS.text,
  icon,
}: any) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Ionicons
        name={icon}
        size={20}
        color={color}
        style={{ marginRight: 8 }}
      />

      <Text style={[styles.sectionTitle, { color }]}>
        {title}
      </Text>
    </View>

    {children}
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  darkOverlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
  },

  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  navTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  container: {
    padding: 20,
  },

  card: {
    backgroundColor: COLORS.overlay,
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },

  foodImage: {
    width: "100%",
    height: 250,
    borderRadius: 24,
    marginBottom: 25,
    borderWidth: 4,
    borderColor: COLORS.white,
  },

  imagePlaceholder: {
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    marginBottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.5,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  dateText: {
    color: COLORS.muted,
    fontSize: 14,
    marginLeft: 4,
    fontWeight: "500",
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  statBox: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 18,
    alignItems: "center",
    width: "23%",
    elevation: 2,
  },

  statValue: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
  },

  statLabel: {
    fontSize: 9,
    color: COLORS.muted,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  statUnderline: {
    height: 3,
    width: 15,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginVertical: 4,
  },

  statName: {
    fontSize: 10,
    color: COLORS.text,
    fontWeight: "700",
  },

  section: {
    marginBottom: 25,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  ingredientsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  ingredientChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
  },

  ingredientText: {
    marginLeft: 6,
    color: COLORS.primaryDark,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  foodItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.5)",
  },

  foodItemInfo: {
    flex: 1,
  },

  foodItemName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    textTransform: "capitalize",
  },

  foodItemWeight: {
    fontSize: 12,
    color: COLORS.muted,
  },

  foodItemCalories: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  itemCalsText: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.primary,
  },

  itemCalsLabel: {
    fontSize: 10,
    color: COLORS.muted,
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    backgroundColor: COLORS.primaryLight,
    padding: 10,
    borderRadius: 12,
  },

  bulletText: {
    fontSize: 14,
    color: COLORS.primaryDark,
    marginLeft: 8,
    flex: 1,
    fontWeight: "600",
  },

  warningText: {
    color: COLORS.danger,
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "600",
  },

  safeContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },

  safeNote: {
    color: COLORS.primary,
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 13,
  },
});