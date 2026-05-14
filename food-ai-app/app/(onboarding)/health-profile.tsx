
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

export default function personaldetails() {
  const router = useRouter();
  const completeOnboarding = useAuthStore(
    (s) => s.completeOnboarding
  );

  const [loading, setLoading] = useState(false);

  /* ================= BODY STATS ================= */

  const [goal, setGoal] =
    useState<GoalType>("maintain");

  const [gender, setGender] =
    useState("male");

  const [age, setAge] = useState("");

  const [weightKg, setWeightKg] =
    useState("");

  const [heightCm, setHeightCm] =
    useState("");

  const [allergies, setAllergies] =
    useState("");

  /* ================= GOALS ================= */

  const [dailyCalorieGoal, setDailyCalorieGoal] =
    useState("");

  const [proteinGoal, setProteinGoal] =
    useState("");

  const [carbsGoal, setCarbsGoal] =
    useState("");

  const [fatGoal, setFatGoal] =
    useState("");

  const [sugarGoal, setSugarGoal] =
    useState("");

  const [waterGoal, setWaterGoal] =
    useState("");

  /* ================= AUTO CALCULATE ================= */

  useEffect(() => {
    if (
      age &&
      weightKg &&
      heightCm
    ) {
      const w = parseFloat(weightKg);
      const h = parseFloat(heightCm);
      const a = parseFloat(age);

      if (
        isNaN(w) ||
        isNaN(h) ||
        isNaN(a)
      )
        return;

      // BMR Formula
      let bmr = 0;

      if (gender === "male") {
        bmr =
          10 * w +
          6.25 * h -
          5 * a +
          5;
      } else {
        bmr =
          10 * w +
          6.25 * h -
          5 * a -
          161;
      }

      let maintenanceCalories =
        Math.round(bmr * 1.2);

      let targetCalories =
        maintenanceCalories;

      let proteinMultiplier = 1.2;

      if (goal === "lose") {
        targetCalories -= 500;
        proteinMultiplier = 1.6;
      }

      if (goal === "gain") {
        targetCalories += 500;
        proteinMultiplier = 1.8;
      }

      // Protein
      const protein = Math.round(
        w * proteinMultiplier
      );

      // Fat
      const fat = Math.round(
        (targetCalories * 0.25) / 9
      );

      // Carbs
      const carbs = Math.round(
        (targetCalories -
          protein * 4 -
          fat * 9) /
          4
      );

      // Water
      const water = (
        w * 0.033
      ).toFixed(1);

      setDailyCalorieGoal(
        targetCalories.toString()
      );

      setProteinGoal(
        protein.toString()
      );

      setFatGoal(fat.toString());

      setCarbsGoal(
        carbs.toString()
      );

      setSugarGoal("50");

      setWaterGoal(water);
    }
  }, [
    age,
    weightKg,
    heightCm,
    goal,
    gender,
  ]);

  /* ================= SAVE ================= */

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        gender,

        healthProfile: {
          weightGoal: goal,

          age: Number(age),

          weightKg: Number(weightKg),

          heightCm: Number(heightCm),

          dailyCalorieGoal:
            Number(
              dailyCalorieGoal
            ),

          proteinGoalG:
            Number(proteinGoal),

          carbsGoalG:
            Number(carbsGoal),

          fatGoalG:
            Number(fatGoal),

          sugarGoalG:
            Number(sugarGoal),

          waterGoalL:
            Number(waterGoal),

          allergies: allergies
            ? allergies
                .split(",")
                .map((a) =>
                  a.trim()
                )
            : [],
        },
      };

      await api.put(
        "/api/auth/updategoals",
        payload
      );

      completeOnboarding();

      router.replace(
        "/(tabs)/dashboard"
      );
    } catch (error) {
      console.error(
        "Failed to save health profile",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= LABEL ================= */

  const InputLabel = ({
    label,
    icon,
  }: {
    label: string;
    icon: any;
  }) => (
    <View style={styles.labelContainer}>
      <Ionicons
        name={icon}
        size={16}
        color={PRIMARY}
        style={{ marginRight: 6 }}
      />

      <Text style={styles.inputLabel}>
        {label}
      </Text>
    </View>
  );

  /* ================= UI ================= */

  return (
    <KeyboardAvoidingView
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <ScrollView
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.title}>
            Health Profile 🌿
          </Text>

          <Text style={styles.subtitle}>
            Help us tailor your
            nutrition journey
          </Text>
        </View>

        {/* GOAL */}

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            What is your primary
            goal?
          </Text>

          <View
            style={
              styles.goalContainer
            }
          >
            {(
              [
                "lose",
                "maintain",
                "gain",
              ] as GoalType[]
            ).map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() =>
                  setGoal(g)
                }
                style={[
                  styles.goalButton,
                  goal === g &&
                    styles.goalButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.goalButtonText,
                    goal === g &&
                      styles.goalButtonTextActive,
                  ]}
                >
                  {g
                    .charAt(0)
                    .toUpperCase() +
                    g.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* BODY STATS */}

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Body Stats
          </Text>

          {/* Gender */}

          <InputLabel
            label="Gender"
            icon="person-outline"
          />

          <View
            style={
              styles.genderContainer
            }
          >
            {[
              "male",
              "female",
            ].map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.genderButton,
                  gender === g &&
                    styles.genderButtonActive,
                ]}
                onPress={() =>
                  setGender(g)
                }
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === g &&
                      styles.genderButtonTextActive,
                  ]}
                >
                  {g
                    .charAt(0)
                    .toUpperCase() +
                    g.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View
              style={{
                flex: 1,
                marginRight: 10,
              }}
            >
              <InputLabel
                label="Age"
                icon="calendar-outline"
              />

              <TextInput
                keyboardType="number-pad"
                value={age}
                onChangeText={setAge}
                style={styles.input}
                placeholder="25"
              />
            </View>

            <View
              style={{ flex: 1 }}
            >
              <InputLabel
                label="Weight (kg)"
                icon="fitness-outline"
              />

              <TextInput
                keyboardType="numeric"
                value={weightKg}
                onChangeText={
                  setWeightKg
                }
                style={styles.input}
                placeholder="70"
              />
            </View>
          </View>

          <InputLabel
            label="Height (cm)"
            icon="resize-outline"
          />

          <TextInput
            keyboardType="numeric"
            value={heightCm}
            onChangeText={setHeightCm}
            style={styles.input}
            placeholder="175"
          />
        </View>

        {/* DAILY GOALS */}

        <View style={styles.section}>
          <View
            style={
              styles.sectionHeaderRow
            }
          >
            <Text
              style={
                styles.sectionTitle
              }
            >
              Daily Goals
            </Text>

            {age &&
              weightKg &&
              heightCm && (
                <Text
                  style={
                    styles.suggestionHint
                  }
                >
                  ✨ Auto Calculated
                </Text>
              )}
          </View>

          {/* Calories */}

          <InputLabel
            label="Calories (kcal)"
            icon="flame-outline"
          />

          <TextInput
            keyboardType="numeric"
            value={
              dailyCalorieGoal
            }
            onChangeText={
              setDailyCalorieGoal
            }
            style={styles.input}
          />

          {/* Protein + Carbs */}

          <View style={styles.row}>
            <View
              style={{
                flex: 1,
                marginRight: 10,
              }}
            >
              <InputLabel
                label="Protein (g)"
                icon="barbell-outline"
              />

              <TextInput
                keyboardType="numeric"
                value={
                  proteinGoal
                }
                onChangeText={
                  setProteinGoal
                }
                style={styles.input}
              />
            </View>

            <View
              style={{ flex: 1 }}
            >
              <InputLabel
                label="Carbs (g)"
                icon="pizza-outline"
              />

              <TextInput
                keyboardType="numeric"
                value={carbsGoal}
                onChangeText={
                  setCarbsGoal
                }
                style={styles.input}
              />
            </View>
          </View>

          {/* Fat + Sugar */}

          <View style={styles.row}>
            <View
              style={{
                flex: 1,
                marginRight: 10,
              }}
            >
              <InputLabel
                label="Fat (g)"
                icon="water-outline"
              />

              <TextInput
                keyboardType="numeric"
                value={fatGoal}
                onChangeText={
                  setFatGoal
                }
                style={styles.input}
              />
            </View>

            <View
              style={{ flex: 1 }}
            >
              <InputLabel
                label="Sugar (g)"
                icon="ice-cream-outline"
              />

              <TextInput
                keyboardType="numeric"
                value={sugarGoal}
                onChangeText={
                  setSugarGoal
                }
                style={styles.input}
              />
            </View>
          </View>

          {/* WATER */}

          <InputLabel
            label="Water Goal (L)"
            icon="beaker-outline"
          />

          <TextInput
            keyboardType="numeric"
            value={waterGoal}
            onChangeText={
              setWaterGoal
            }
            style={styles.input}
          />
        </View>

        {/* ALLERGIES */}

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Allergies
          </Text>

          <InputLabel
            label="Avoid Ingredients"
            icon="warning-outline"
          />

          <TextInput
            placeholder="Peanuts, Dairy..."
            value={allergies}
            onChangeText={
              setAllergies
            }
            style={[
              styles.input,
              {
                height: 80,
                textAlignVertical:
                  "top",
              },
            ]}
            multiline
          />
        </View>

        {/* SAVE */}

        {loading ? (
          <ActivityIndicator
            color={PRIMARY}
            size="large"
            style={{
              marginVertical: 20,
            }}
          />
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
          >
            <Text
              style={
                styles.buttonText
              }
            >
              Finish Setup
            </Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color="#fff"
              style={{
                marginLeft: 8,
              }}
            />
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 60,
  },

  header: {
    marginBottom: 25,
    marginTop:
      Platform.OS === "ios"
        ? 40
        : 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#14532d",
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 4,
  },

  section: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,

    borderWidth: 1,
    borderColor: "#f1f5f9",

    elevation: 2,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.05,

    shadowRadius: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent:
      "space-between",
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
  },

  input: {
    backgroundColor:
      SECONDARY,

    padding: 14,

    borderRadius: 14,

    marginBottom: 16,

    fontSize: 16,

    fontWeight: "700",

    color: "#1e293b",

    borderWidth: 1,

    borderColor: "#d1fae5",
  },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: 15,
  },

  suggestionHint: {
    fontSize: 12,
    color: PRIMARY,
    fontWeight: "700",
  },

  goalContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 5,
  },

  goalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  goalButtonActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  goalButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },

  goalButtonTextActive: {
    color: "#fff",
  },

  genderContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },

  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  genderButtonActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  genderButtonText: {
    color: "#64748b",
    fontWeight: "700",
  },

  genderButtonTextActive: {
    color: "#fff",
  },

  button: {
    backgroundColor: PRIMARY,
    padding: 20,
    borderRadius: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 18,
  },
});