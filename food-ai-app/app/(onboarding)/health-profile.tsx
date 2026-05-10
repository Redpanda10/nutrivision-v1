import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { useAuthStore } from "../../stores/authStore";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY = "#16a34a";
const SECONDARY = "#f0fdf4";

type GoalType = "lose" | "maintain" | "gain";

export default function HealthProfile() {
  const router = useRouter();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  const [loading, setLoading] = useState(false);
  
  // Body Stats & Goal
  const [goal, setGoal] = useState<GoalType>("maintain");
  const [age, setAge] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [allergies, setAllergies] = useState("");

  // Daily Goals
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState("");
  const [proteinGoal, setProteinGoal] = useState("");
  const [fatGoal, setFatGoal] = useState("");
  const [sugarGoal, setSugarGoal] = useState("");
  const [waterGoal, setWaterGoal] = useState("");

  // Auto-calculate logic
  useEffect(() => {
    if (age && weightKg && heightCm) {
      const w = parseFloat(weightKg);
      const h = parseFloat(heightCm);
      const a = parseFloat(age);

      // BMR (Mifflin-St Jeor)
      const bmr = 10 * w + 6.25 * h - 5 * a + 5;
      let maintenanceCals = Math.round(bmr * 1.2);
      
      // Adjust based on goal
      let targetCals = maintenanceCals;
      let proteinMultiplier = 1.2;

      if (goal === "lose") {
        targetCals -= 500;
        proteinMultiplier = 1.5; // Higher protein to preserve muscle during cut
      } else if (goal === "gain") {
        targetCals += 500;
        proteinMultiplier = 1.8; // High protein for muscle build
      }

      setDailyCalorieGoal(targetCals.toString());
      setProteinGoal(Math.round(w * proteinMultiplier).toString());
      setFatGoal(Math.round((targetCals * 0.25) / 9).toString());
      setSugarGoal("50");
      setWaterGoal((w * 0.033).toFixed(1));
    }
  }, [age, weightKg, heightCm, goal]);

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      healthProfile: {
        weightGoal: goal,
        age: Number(age),
        weightKg: Number(weightKg),
        heightCm: Number(heightCm),
        dailyCalorieGoal: Number(dailyCalorieGoal),
        proteinGoalG: Number(proteinGoal),
        fatGoalG: Number(fatGoal),
        sugarGoalG: Number(sugarGoal),
        waterGoalL: Number(waterGoal),
        allergies: allergies ? allergies.split(",").map((a) => a.trim()) : [],
      },
    };

    try {
      await api.post("/api/auth/profile", payload);
      completeOnboarding();
      router.replace("/(tabs)/dashboard");
    } catch (error) {
      console.error("Failed to save health profile", error);
    } finally {
      setLoading(false);
    }
  };

  const InputLabel = ({ label, icon }: { label: string; icon: any }) => (
    <View style={styles.labelContainer}>
      <Ionicons name={icon} size={16} color={PRIMARY} style={{ marginRight: 6 }} />
      <Text style={styles.inputLabel}>{label}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Health Profile 🌿</Text>
          <Text style={styles.subtitle}>Help us tailor your nutrition journey</Text>
        </View>

        {/* GOAL SELECTOR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is your primary goal?</Text>
          <View style={styles.goalContainer}>
            {(['lose', 'maintain', 'gain'] as GoalType[]).map((g) => (
              <TouchableOpacity 
                key={g} 
                onPress={() => setGoal(g)}
                style={[styles.goalButton, goal === g && styles.goalButtonActive]}
              >
                <Text style={[styles.goalButtonText, goal === g && styles.goalButtonTextActive]}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Body Stats</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <InputLabel label="Age" icon="calendar-outline" />
              <TextInput keyboardType="number-pad" value={age} onChangeText={setAge} style={styles.input} placeholder="25" />
            </View>
            <View style={{ flex: 1 }}>
              <InputLabel label="Weight (kg)" icon="fitness-outline" />
              <TextInput keyboardType="numeric" value={weightKg} onChangeText={setWeightKg} style={styles.input} placeholder="70" />
            </View>
          </View>
          <InputLabel label="Height (cm)" icon="resize-outline" />
          <TextInput keyboardType="numeric" value={heightCm} onChangeText={setHeightCm} style={styles.input} placeholder="175" />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Daily Goals</Text>
            {age && weightKg && <Text style={styles.suggestionHint}>✨ Personalized for you</Text>}
          </View>
          
          <InputLabel label="Calories (kcal)" icon="flame-outline" />
          <TextInput keyboardType="numeric" value={dailyCalorieGoal} onChangeText={setDailyCalorieGoal} style={styles.input} />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <InputLabel label="Protein (g)" icon="barbell-outline" />
              <TextInput keyboardType="numeric" value={proteinGoal} onChangeText={setProteinGoal} style={styles.input} />
            </View>
            <View style={{ flex: 1 }}>
              <InputLabel label="Fats (g)" icon="water-outline" />
              <TextInput keyboardType="numeric" value={fatGoal} onChangeText={setFatGoal} style={styles.input} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <InputLabel label="Sugar (g)" icon="ice-cream-outline" />
              <TextInput keyboardType="numeric" value={sugarGoal} onChangeText={setSugarGoal} style={styles.input} />
            </View>
            <View style={{ flex: 1 }}>
              <InputLabel label="Water (L)" icon="beaker-outline" />
              <TextInput keyboardType="numeric" value={waterGoal} onChangeText={setWaterGoal} style={styles.input} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergies</Text>
          <InputLabel label="Avoid Ingredients" icon="warning-outline" />
          <TextInput 
            placeholder="Peanuts, Dairy..." 
            value={allergies} 
            onChangeText={setAllergies} 
            style={[styles.input, { height: 60, textAlignVertical: 'top' }]} 
            multiline 
          />
        </View>

        {loading ? (
          <ActivityIndicator color={PRIMARY} size="large" style={{ marginVertical: 20 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Finish Setup</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 60 },
  header: { marginBottom: 25, marginTop: Platform.OS === 'ios' ? 40 : 20 },
  title: { fontSize: 30, fontWeight: "900", color: "#14532d", letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: "#6b7280", marginTop: 4 },
  section: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  goalContainer: { flexDirection: 'row', gap: 8, marginTop: 5 },
  goalButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#f8fafc', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  goalButtonActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  goalButtonText: { fontSize: 14, fontWeight: '700', color: '#64748b' },
  goalButtonTextActive: { color: '#fff' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: "#1e293b", marginBottom: 12 },
  labelContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  inputLabel: { fontSize: 13, fontWeight: "700", color: "#64748b" },
  suggestionHint: { fontSize: 12, color: PRIMARY, fontWeight: '700' },
  row: { flexDirection: "row", justifyContent: "space-between" },
  input: {
    backgroundColor: SECONDARY,
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    fontSize: 16,
    fontWeight: '700',
    color: "#1e293b",
    borderWidth: 1,
    borderColor: "#d1fae5",
  },
  button: {
    backgroundColor: PRIMARY,
    padding: 20,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "800", fontSize: 18 },
});