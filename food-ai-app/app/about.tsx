import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function About() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>About NutriVision</Text>
        <Text style={styles.subTitle}>AI-powered nutrition tracking platform</Text>

        {/* INTRO */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🌱 Our Mission</Text>
          <Text style={styles.text}>
            NutriVision is built to make nutrition tracking effortless using AI.
            We help you understand what you eat in real time and build healthier habits
            without manual logging.
          </Text>
        </View>

        {/* WHAT IT DOES */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🚀 What It Does</Text>

          <Text style={styles.bullet}>• Detects food using AI image recognition</Text>
          <Text style={styles.bullet}>• Calculates calories and macros instantly</Text>
          <Text style={styles.bullet}>• Tracks daily nutrition automatically</Text>
          <Text style={styles.bullet}>• Warns about allergens and unsafe foods</Text>
        </View>

        {/* FEATURES */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>✨ Key Features</Text>

          <Text style={styles.bullet}>• Real-time AI food scanning</Text>
          <Text style={styles.bullet}>• Personalized calorie goals</Text>
          <Text style={styles.bullet}>• Macro breakdown (protein, carbs, fat)</Text>
          <Text style={styles.bullet}>• Smart health insights</Text>
          <Text style={styles.bullet}>• Meal history tracking</Text>
        </View>

        {/* TECHNOLOGY */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🧠 Technology</Text>

          <Text style={styles.text}>
            NutriVision uses modern AI models (YOLO-based detection),
            USDA nutrition database integration, and a secure Node.js backend
            to deliver accurate real-time food analysis.
          </Text>
        </View>

        {/* WHY IT EXISTS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>💡 Why We Built It</Text>

          <Text style={styles.text}>
            Most nutrition apps are manual and time-consuming.
            NutriVision removes friction by using AI to automatically
            understand your meals and give instant insights.
          </Text>
        </View>

        {/* FUTURE */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🔮 What’s Next</Text>

          <Text style={styles.bullet}>• Wearable integration</Text>
          <Text style={styles.bullet}>• AI diet coach</Text>
          <Text style={styles.bullet}>• Personalized meal plans</Text>
          <Text style={styles.bullet}>• Voice-based food logging</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECFDF5",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0f172a",
  },

  subTitle: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    color: "#14532d",
  },

  text: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 22,
  },

  bullet: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 6,
  },
});