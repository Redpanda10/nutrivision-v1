import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#16a34a",
  primaryDark: "#14532d",
  background: "#f0fdf4", 
  card: "#ffffff",
  text: "#1e293b",
  muted: "#64748b",
  accent: "#22c55e",
  border: "#dcfce7",
};

export default function Privacy() {
  const insets = useSafeAreaInsets();

  const handleEmail = () => {
    Linking.openURL('mailto:support@nutrivision.app');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER WITH GRADIENT */}
      <LinearGradient 
        colors={[COLORS.primary, COLORS.primaryDark]} 
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.subTitle}>Last updated: May 2026 • Version 2.0</Text>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <View style={styles.content}>
          
          <Text style={styles.introText}>
            NutriVision AI is committed to shifting nutrition tracking from manual effort to intelligent, automated dietary understanding while protecting your personal health data.
          </Text>

          {/* SECTION: DATA COLLECTION */}
          <Section 
            icon="finger-print" 
            title="Information We Collect"
            description="Essential data for AI analysis"
          >
            <Bullet text="Profile Data: Age, height, weight, and activity levels." />
            <Bullet text="Visual Data: Images captured for food recognition." />
            <Bullet text="Technical Data: Device info used to ensure app stability." />
          </Section>

          {/* SECTION: AI PROCESSING */}
          <Section 
            icon="eye" 
            title="How Our AI Works"
            description="Google Gemini 1.5 Flash Integration"
          >
            <Text style={styles.text}>
              NutriVision utilizes advanced multimodal AI (Gemini 1.5 Flash) to identify food items and estimate composition. Images are processed securely and structured into nutritional insights.
            </Text>
            <View style={styles.bulletList}>
              <Bullet text="Instant recognition of complex, mixed dishes." />
              <Bullet text="Automated portion-based macro estimation." />
            </View>
          </Section>

          {/* SECTION: USAGE */}
          <Section 
            icon="fitness" 
            title="Purpose of Processing"
            description="Improving your health outcomes"
          >
            <Text style={styles.text}>
              We use your data to eliminate the guesswork in modern diets:
            </Text>
            <View style={styles.bulletList}>
              <Bullet text="Cross-checking potential allergy warnings." />
              <Bullet text="Personalizing fitness relevance (Bulking/Cutting)." />
              <Bullet text="Maintaining your historical eating patterns." />
            </View>
          </Section>

          {/* SECTION: SECURITY */}
          <Section 
            icon="shield-half" 
            title="Data Security & Sharing"
            description="Privacy by Design"
          >
            <Text style={styles.text}>
              NutriVision uses JWT authentication and industry-standard encryption. We do not sell or trade your health records.
            </Text>
            <View style={styles.bulletList}>
              <Bullet text="Encrypted storage for all meal history." />
              <Bullet text="Anonymized data for AI accuracy improvements." />
              <Bullet text="Purge your data at any time via account settings." />
            </View>
          </Section>

          {/* SECTION: YOUR RIGHTS */}
          <Section 
            icon="options" 
            title="Your Control"
            description="User Rights & Compliance"
          >
            <View style={styles.bulletList}>
              <Bullet text="Access and export your nutritional history." />
              <Bullet text="Revoke camera and gallery access instantly." />
              <Bullet text="Request permanent account deletion." />
            </View>
          </Section>

          {/* CONTACT BOX */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerHeading}>Have questions?</Text>
            <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
              <Ionicons name="mail" size={20} color="#fff" />
              <Text style={styles.contactText}>Email Privacy Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Sub-component for Sections
const Section = ({ icon, title, description, children }: any) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={22} color={COLORS.primary} />
      </View>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionDesc}>{description}</Text>
      </View>
    </View>
    <View style={styles.divider} />
    {children}
  </View>
);

// Helper component for clean bullets
const Bullet = ({ text }: { text: string }) => (
  <View style={styles.bulletRow}>
    <Ionicons name="checkmark-circle" size={16} color={COLORS.accent} />
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
  },
  subTitle: {
    fontSize: 14,
    color: "#dcfce7",
    marginTop: 4,
    fontWeight: "500",
  },
  content: {
    padding: 20,
  },
  introText: {
    fontSize: 16,
    color: COLORS.primaryDark,
    lineHeight: 24,
    marginBottom: 25,
    textAlign: "center",
    fontWeight: "600",
    opacity: 0.8,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 28,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  sectionDesc: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 15,
  },
  text: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletList: {
    marginTop: 5,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingRight: 10,
  },
  bulletText: {
    fontSize: 14,
    color: "#334155",
    marginLeft: 10,
    fontWeight: "500",
    flex: 1,
  },
  footerContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  footerHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 15,
  },
  contactCard: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 100,
    gap: 10,
    elevation: 4,
  },
  contactText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});