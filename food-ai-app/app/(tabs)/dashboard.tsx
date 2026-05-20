import { useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-chart-kit";
import { api } from "../../lib/api";

type Summary = {
  totals: {
    caloriesKcal: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    sugarG?: number;

    // NEW
    waterMl?: number;
  };

  goals: {
    caloriesKcal: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    sugarG?: number;

    // NEW
    waterMl?: number;
  };
};

const COLORS = {
  primary: "#10B981",
  primaryDark: "#059669",
  background: "#ECFDF5",
  card: "#FFFFFF",
  text: "#0F172A",
  muted: "#64748B",

  protein: "#16A34A",
  carbs: "#3B82F6",
  fat: "#F59E0B",

  sugar: "#EF4444",

  // NEW
  water: "#0EA5E9",

  warning: "#F59E0B",
};

const screenWidth = Dimensions.get("window").width;

/* ================= PROGRESS BAR ================= */

const ProgressBar = ({
  value,
  goal,
  color,
}: {
  value: number;
  goal: number;
  color: string;
}) => {
  const pct = goal > 0 ? value / goal : 0;

  return (
    <View style={styles.barContainer}>
      <View
        style={[
          styles.barFill,
          {
            width: `${Math.min(100, pct * 100)}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSummary = async () => {
    try {
      const res = await api.get("api/food/summary/today");

      setSummary(res.data);
    } catch (error) {
      console.log("DASHBOARD ERROR:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSummary();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchSummary();
  };

  if (loading && !summary) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
      </View>
    );
  }

  const totals = summary?.totals ?? {
    caloriesKcal: 0,
    proteinG: 0,
    carbsG: 0,
    fatG: 0,
    sugarG: 0,

    // NEW
    waterMl: 0,
  };

  const goals = summary?.goals ?? {
    caloriesKcal: 2000,
    proteinG: 120,
    carbsG: 220,
    fatG: 70,
    sugarG: 50,

    // NEW
    waterMl: 3000,
  };

  const greeting =
    new Date().getHours() < 12
      ? "Good Morning"
      : new Date().getHours() < 17
      ? "Good Afternoon"
      : "Good Evening";

  /* ================= PIE CHART ================= */

  const pieData = [
    {
      name: "Protein",
      population: Number(totals.proteinG.toFixed(2)),
      color: COLORS.protein,
      legendFontColor: "#333",
      legendFontSize: 12,
    },

    {
      name: "Carbs",
      population: Number(totals.carbsG.toFixed(2)),
      color: COLORS.carbs,
      legendFontColor: "#333",
      legendFontSize: 12,
    },

    {
      name: "Fat",
      population: Number(totals.fatG.toFixed(2)),
      color: COLORS.fat,
      legendFontColor: "#333",
      legendFontSize: 12,
    },
  ].filter((i) => i.population > 0);

  /* ================= AI TIPS ================= */

  const aiTips: string[] = [];

  if (totals.proteinG < goals.proteinG * 0.6) {
    aiTips.push(
      "Increase protein intake with eggs, chicken, tofu, or lentils."
    );
  }

  if (totals.caloriesKcal > goals.caloriesKcal) {
    aiTips.push(
      "You've exceeded your calorie goal. Consider light exercise today."
    );
  }

  if ((totals.sugarG ?? 0) > (goals.sugarG ?? 50)) {
    aiTips.push(
      "Sugar intake is high. Replace sugary drinks with water or fruits."
    );
  }

  // NEW
  if ((totals.waterMl ?? 0) < (goals.waterMl ?? 3000) * 0.6) {
    aiTips.push(
      "Your hydration is low. Drink more water throughout the day."
    );
  }

  aiTips.push("Stay hydrated 💧");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* ================= HEADER ================= */}

        <Text style={styles.greeting}>
          {greeting} 👋
        </Text>

        <Text style={styles.title}>
          NutriVision Dashboard
        </Text>

        {/* ================= CALORIES ================= */}

        <View style={styles.calorieCard}>
          <Text style={styles.calorieLabel}>
            Daily Calories
          </Text>

           {(totals.caloriesKcal ?? 0) >
            (goals.caloriesKcal ?? 50) ? (
              <Text style={styles.exceeded}>
                Exceeded
              </Text>
            ) : (
              <Text style={styles.good}>
                Good
              </Text>
            )}

          <Text style={styles.calorieMain}>
            {totals.caloriesKcal.toFixed(0)}
          </Text>

          <ProgressBar
            value={totals.caloriesKcal}
            goal={goals.caloriesKcal}
            color="#385624"
          />

          <Text style={styles.calorieSubText}>
            {totals.caloriesKcal.toFixed(0)} /{" "}
            {goals.caloriesKcal.toFixed(0)} kcal
          </Text>
        </View>


        <View style={styles.sugarCard}>
          <View style={styles.row}>
            <Text style={styles.sugarTitle}>
              Sugar Intake
            </Text>

            {(totals.sugarG ?? 0) >
            (goals.sugarG ?? 50) ? (
              <Text style={styles.exceeded}>
                Exceeded
              </Text>
            ) : (
              <Text style={styles.good}>
                Good
              </Text>
            )}
          </View>

          <Text style={styles.sugarValue}>
            {(totals.sugarG ?? 0).toFixed(1)}g
          </Text>

          <ProgressBar
            value={totals.sugarG ?? 0}
            goal={goals.sugarG ?? 50}
            color={COLORS.sugar}
          />

          <Text style={styles.goalText}>
            Goal: {goals.sugarG ?? 50}g
          </Text>
        </View>


        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Macro Distribution
          </Text>

          {pieData.length > 0 ? (
            <PieChart
              data={pieData}
              width={screenWidth - 40}
              height={220}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              chartConfig={{
                color: () => COLORS.text,
              }}
              absolute
            />
          ) : (
            <Text style={styles.emptyText}>
              No nutrition data available
            </Text>
          )}
        </View>


        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            AI Recommendations
          </Text>

          {aiTips.map((tip, i) => (
            <Text key={i} style={styles.tipText}>
              • {tip}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  greeting: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 20,
  },

  calorieCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,
  },

  calorieLabel: {
    color: "#D1FAE5",
    fontWeight: "600",
    fontSize: 15,
  },

  calorieMain: {
    fontSize: 48,
    fontWeight: "900",
    color: "#fff",
    marginVertical: 10,
  },

  calorieSubText: {
    marginTop: 12,
    color: "#D1FAE5",
    fontSize: 14,
  },

  sugarCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  // NEW
  waterCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sugarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  // NEW
  waterTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  sugarValue: {
    fontSize: 38,
    fontWeight: "900",
    color: COLORS.sugar,
    marginVertical: 10,
  },

  // NEW
  waterValue: {
    fontSize: 38,
    fontWeight: "900",
    color: COLORS.water,
    marginVertical: 10,
  },

  exceeded: {
    color: COLORS.sugar,
    fontWeight: "700",
  },

  good: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  // NEW
  waterPending: {
    color: COLORS.water,
    fontWeight: "700",
  },

  goalText: {
    marginTop: 10,
    color: COLORS.muted,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 10,
  },

  tipText: {
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 22,
  },

  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    color: COLORS.muted,
  },

  barContainer: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 8,
  },

  barFill: {
    height: "100%",
    borderRadius: 20,
  },
});