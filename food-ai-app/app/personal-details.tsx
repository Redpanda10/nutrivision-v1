import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function PersonalDetails() {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",

    goal: "",

    weightKg: "",
    heightCm: "",

    dailyCalories: "",
    waterGoal: "",
    proteinGoal: "",
    carbsGoal: "",
    fatGoal: "",
    sugarGoal: "",

    allergies: "",
  });

  /* ================= FETCH PROFILE ================= */

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/auth/protected`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = res.data;
      const hp = user.healthProfile || {};

      setProfile({
        name: user.name || "",
        age: String(hp.age || ""),
        gender: user.gender ,

        goal: hp.weightGoal ,

        weightKg: String(hp.weightKg || ""),
        heightCm: String(hp.heightCm || ""),

        dailyCalories: String(hp.dailyCalorieGoal || ""),
        waterGoal: String(hp.waterGoalL || ""),
        proteinGoal: String(hp.proteinGoalG || ""),
        carbsGoal: String(hp.carbsGoalG || ""),
        fatGoal: String(hp.fatGoalG || ""),
        sugarGoal: String(hp.sugarGoalG || ""),

        allergies: hp.allergies?.join(", ") || "",
      });
    } catch (err: any) {
      console.error(
        "Fetch Error:",
        err.response?.data || err.message
      );

      Alert.alert("Error", "Could not load profile data.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= AUTO CALCULATIONS ================= */

  useEffect(() => {
    if (
      profile.age &&
      profile.weightKg &&
      profile.heightCm
    ) {
      const w = parseFloat(profile.weightKg);
      const h = parseFloat(profile.heightCm);
      const a = parseFloat(profile.age);

      // BMR Formula
      const bmr = 10 * w + 6.25 * h - 5 * a + 5;

      let maintenanceCals = Math.round(bmr * 1.2);

      let targetCals = maintenanceCals;
      let proteinMultiplier = 1.2;

      if (profile.goal === "lose_weight") {
        targetCals -= 500;
        proteinMultiplier = 1.5;
      } else if (profile.goal === "gain_weight") {
        targetCals += 500;
        proteinMultiplier = 1.8;
      }

      updateField(
        "dailyCalories",
        targetCals.toString()
      );

      updateField(
        "proteinGoal",
        Math.round(w * proteinMultiplier).toString()
      );

      updateField(
        "fatGoal",
        Math.round((targetCals * 0.25) / 9).toString()
      );

      updateField("sugarGoal", "50");

      updateField(
        "waterGoal",
        (w * 0.033).toFixed(1)
      );
    }
  }, [
    profile.age,
    profile.weightKg,
    profile.heightCm,
    profile.goal,
  ]);

  /* ================= UPDATE FIELD ================= */

  const updateField = (
    key: string,
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* ================= SAVE PROFILE ================= */

  const handleSave = async () => {
    try {
      setSaveLoading(true);

      const token = await AsyncStorage.getItem("token");

      const payload = {
        name: profile.name,
        gender: profile.gender,

        healthProfile: {
          weightGoal: profile.goal,

          age: Number(profile.age),
          weightKg: Number(profile.weightKg),
          heightCm: Number(profile.heightCm),

          dailyCalorieGoal: Number(
            profile.dailyCalories
          ),

          proteinGoalG: Number(profile.proteinGoal),
          carbsGoalG: Number(profile.carbsGoal),
          fatGoalG: Number(profile.fatGoal),
          sugarGoalG: Number(profile.sugarGoal),

          waterGoalL: Number(profile.waterGoal),

          allergies: profile.allergies
            ? profile.allergies
                .split(",")
                .map((a) => a.trim())
            : [],
        },
      };

      await axios.put(
        `${BASE_URL}/api/auth/updategoals`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert(
        "Success ✨",
        "Your profile has been updated."
      );
    } catch (err: any) {
      console.error(
        "Save Error:",
        err.response?.data || err.message
      );

      Alert.alert(
        "Error",
        "Failed to update profile"
      );
    } finally {
      setSaveLoading(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center" },
        ]}
      >
        <ActivityIndicator
          size="large"
          color="#16a34a"
        />
      </View>
    );
  }

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
          }}
        >
          {/* HEADER */}

          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color="#0f172a"
              />
            </TouchableOpacity>

            <View>
              <Text style={styles.title}>
                Profile Details
              </Text>

              <Text style={styles.subtitle}>
                Fine-tune your AI health
                experience
              </Text>
            </View>
          </View>

          {/* BASIC INFO */}

          <Section
            icon="person-outline"
            title="The Basics"
          >
            <InteractiveInput
              label="Full Name"
              value={profile.name}
              onFocus={() =>
                setFocusedField("name")
              }
              onBlur={() =>
                setFocusedField(null)
              }
              isFocused={
                focusedField === "name"
              }
              onChange={(v) =>
                updateField("name", v)
              }
            />

            <View style={styles.row}>
              <View
                style={{
                  flex: 1,
                  marginRight: 10,
                }}
              >
                <InteractiveInput
                  label="Age"
                  value={String(
                    profile.age || ""
                  )}
                  keyboardType="numeric"
                  onFocus={() =>
                    setFocusedField("age")
                  }
                  onBlur={() =>
                    setFocusedField(null)
                  }
                  isFocused={
                    focusedField === "age"
                  }
                  onChange={(v) =>
                    updateField("age", v)
                  }
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>
                  Gender
                </Text>

                <View style={styles.pickerRow}>
                  {["male", "female"].map(
                    (g) => (
                      <TouchableOpacity
                        key={g}
                        style={[
                          styles.pickerOption,
                          profile.gender ===
                            g &&
                            styles.pickerActive,
                        ]}
                        onPress={() =>
                          updateField(
                            "gender",
                            g
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.pickerText,
                            profile.gender ===
                              g &&
                              styles.pickerTextActive,
                          ]}
                        >
                          {g
                            .charAt(0)
                            .toUpperCase() +
                            g.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View
                style={{
                  flex: 1,
                  marginRight: 10,
                }}
              >
                <InteractiveInput
                  label="Weight (kg)"
                  value={String(
                    profile.weightKg || ""
                  )}
                  keyboardType="numeric"
                  onFocus={() =>
                    setFocusedField(
                      "weightKg"
                    )
                  }
                  onBlur={() =>
                    setFocusedField(null)
                  }
                  isFocused={
                    focusedField ===
                    "weightKg"
                  }
                  onChange={(v) =>
                    updateField(
                      "weightKg",
                      v
                    )
                  }
                />
              </View>

              <View style={{ flex: 1 }}>
                <InteractiveInput
                  label="Height (cm)"
                  value={String(
                    profile.heightCm || ""
                  )}
                  keyboardType="numeric"
                  onFocus={() =>
                    setFocusedField(
                      "heightCm"
                    )
                  }
                  onBlur={() =>
                    setFocusedField(null)
                  }
                  isFocused={
                    focusedField ===
                    "heightCm"
                  }
                  onChange={(v) =>
                    updateField(
                      "heightCm",
                      v
                    )
                  }
                />
              </View>
            </View>
          </Section>

          {/* GOAL */}

          <Section
            icon="flag-outline"
            title="Your Primary Goal"
          >
            <View style={styles.goalContainer}>
              {[
                {
                  id: "lose_weight",
                  label: "Lose",
                  icon: "trending-down",
                },
                {
                  id: "maintain",
                  label: "Maintain",
                  icon: "pause",
                },
                {
                  id: "gain_weight",
                  label: "Gain",
                  icon: "trending-up",
                },
              ].map((item: any) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.goalCard,
                    profile.goal ===
                      item.id &&
                      styles.goalCardActive,
                  ]}
                  onPress={() =>
                    updateField(
                      "goal",
                      item.id
                    )
                  }
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={
                      profile.goal ===
                      item.id
                        ? "#fff"
                        : "#16a34a"
                    }
                  />

                  <Text
                    style={[
                      styles.goalLabel,
                      profile.goal ===
                        item.id &&
                        styles.goalLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Section>

          {/* DAILY TARGETS */}

          <Section
            icon="nutrition-outline"
            title="Daily Targets"
          >
            <View style={styles.row}>
              <View
                style={{
                  flex: 1,
                  marginRight: 10,
                }}
              >
                <InteractiveInput
                  label="Calories (kcal)"
                  value={String(
                    profile.dailyCalories ||
                      ""
                  )}
                  keyboardType="numeric"
                  onChange={(v) =>
                    updateField(
                      "dailyCalories",
                      v
                    )
                  }
                />
              </View>

              <View style={{ flex: 1 }}>
                <InteractiveInput
                  label="Water (L)"
                  value={String(
                    profile.waterGoal || ""
                  )}
                  keyboardType="numeric"
                  onChange={(v) =>
                    updateField(
                      "waterGoal",
                      v
                    )
                  }
                />
              </View>
            </View>

            <View style={styles.row}>
              <View
                style={{
                  flex: 1,
                  marginRight: 8,
                }}
              >
                <InteractiveInput
                  label="Protein"
                  value={String(
                    profile.proteinGoal ||
                      ""
                  )}
                  keyboardType="numeric"
                  onChange={(v) =>
                    updateField(
                      "proteinGoal",
                      v
                    )
                  }
                />
              </View>

              <View
                style={{
                  flex: 1,
                  marginRight: 8,
                }}
              >
                <InteractiveInput
                  label="Carbs"
                  value={String(
                    profile.carbsGoal ||
                      ""
                  )}
                  keyboardType="numeric"
                  onChange={(v) =>
                    updateField(
                      "carbsGoal",
                      v
                    )
                  }
                />
              </View>

              <View
                style={{
                  flex: 1,
                  marginRight: 8,
                }}
              >
                <InteractiveInput
                  label="Fat"
                  value={String(
                    profile.fatGoal || ""
                  )}
                  keyboardType="numeric"
                  onChange={(v) =>
                    updateField(
                      "fatGoal",
                      v
                    )
                  }
                />
              </View>

              <View style={{ flex: 1 }}>
                <InteractiveInput
                  label="Sugar"
                  value={String(
                    profile.sugarGoal ||
                      ""
                  )}
                  keyboardType="numeric"
                  onChange={(v) =>
                    updateField(
                      "sugarGoal",
                      v
                    )
                  }
                />
              </View>
            </View>
          </Section>

          {/* ALLERGIES */}

          <Section
            icon="warning-outline"
            title="Allergies & Restrictions"
          >
            <InteractiveInput
              label="Avoid Ingredients"
              value={profile.allergies}
              onChange={(v) =>
                updateField(
                  "allergies",
                  v
                )
              }
            />
          </Section>

          {/* SAVE BUTTON */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.button,
              saveLoading && {
                opacity: 0.7,
              },
            ]}
            onPress={handleSave}
            disabled={saveLoading}
          >
            {saveLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.btnContent}>
                <Text
                  style={styles.buttonText}
                >
                  Save Profile
                </Text>

                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#fff"
                />
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ================= HELPERS ================= */

const Section = ({
  title,
  icon,
  children,
}: any) => (
  <View style={styles.card}>
    <View style={styles.sectionHeader}>
      <Ionicons
        name={icon}
        size={18}
        color="#16a34a"
      />

      <Text style={styles.sectionTitle}>
        {title}
      </Text>
    </View>

    {children}
  </View>
);

const InteractiveInput = ({
  label,
  value,
  onChange,
  isFocused,
  onFocus,
  onBlur,
  keyboardType = "default",
}: any) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={styles.label}>
      {label}
    </Text>

    <TextInput
      value={value}
      onFocus={onFocus}
      onBlur={onBlur}
      onChangeText={onChange}
      keyboardType={keyboardType}
      style={[
        styles.input,
        isFocused &&
          styles.inputFocused,
      ]}
      selectionColor="#16a34a"
    />
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },

  backBtn: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 12,
    marginRight: 15,

    elevation: 2,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
  },

  subtitle: {
    fontSize: 13,
    color: "#64748b",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 3,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 6,
    marginLeft: 2,
  },

  input: {
    backgroundColor: "#F1F5F9",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    color: "#1e293b",

    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  inputFocused: {
    borderColor: "#16a34a",
    backgroundColor: "#fff",
  },

  pickerRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    padding: 4,
    borderRadius: 12,
  },

  pickerOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },

  pickerActive: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowOpacity: 0.1,
  },

  pickerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },

  pickerTextActive: {
    color: "#16a34a",
  },

  goalContainer: {
    flexDirection: "row",
    gap: 10,
  },

  goalCard: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    gap: 6,

    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  goalCardActive: {
    backgroundColor: "#16a34a",
    borderColor: "#16a34a",
  },

  goalLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },

  goalLabelActive: {
    color: "#fff",
  },

  button: {
    backgroundColor: "#16a34a",
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,

    shadowColor: "#16a34a",
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.3,
    shadowRadius: 8,

    elevation: 5,
  },

  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
});
