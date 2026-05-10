import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { api } from "../../lib/api";
import { useAuthStore } from "../../stores/authStore";

const PRIMARY = "#16a34a";

export default function HealthProfile() {
  const router = useRouter();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  const [age, setAge] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState("");
  const [allergies, setAllergies] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);

    const payload = {
      healthProfile: {
        age: age ? Number(age) : undefined,
        weightKg: weightKg ? Number(weightKg) : undefined,
        heightCm: heightCm ? Number(heightCm) : undefined,
        dailyCalorieGoal: dailyCalorieGoal
          ? Number(dailyCalorieGoal)
          : undefined,
        allergies: allergies
          ? allergies.split(",").map((a) => a.trim())
          : undefined,
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Health Profile 🌿</Text>
      <Text style={styles.subtitle}>
        Help us personalize your nutrition insights
      </Text>

      <TextInput
        placeholder="Age"
        placeholderTextColor="#7a7a7a"
        keyboardType="number-pad"
        value={age}
        onChangeText={setAge}
        style={styles.input}
      />

      <TextInput
        placeholder="Weight (kg)"
        placeholderTextColor="#7a7a7a"
        keyboardType="numeric"
        value={weightKg}
        onChangeText={setWeightKg}
        style={styles.input}
      />

      <TextInput
        placeholder="Height (cm)"
        placeholderTextColor="#7a7a7a"
        keyboardType="numeric"
        value={heightCm}
        onChangeText={setHeightCm}
        style={styles.input}
      />

      <TextInput
        placeholder="Daily Calorie Goal"
        placeholderTextColor="#7a7a7a"
        keyboardType="numeric"
        value={dailyCalorieGoal}
        onChangeText={setDailyCalorieGoal}
        style={styles.input}
      />

      <TextInput
        placeholder="Allergies (comma separated)"
        placeholderTextColor="#7a7a7a"
        value={allergies}
        onChangeText={setAllergies}
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator color={PRIMARY} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Finish Setup</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f7fff9",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#14532d",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1fae5",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  button: {
    backgroundColor: PRIMARY,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});