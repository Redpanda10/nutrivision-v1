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
  Platform
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
};

// ... (Type Definitions remain the same)

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
        <Text style={{ marginTop: 10, color: COLORS.muted }}>Fetching Details...</Text>
      </View>
    );
  }

  if (!entry) return <View style={styles.center}><Text>Meal not found.</Text></View>;

  const n = entry.nutrition || {};
  const safety = entry.safetyCheck || {};
  const insights = entry.insights || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* CUSTOM TOP NAV BAR */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Meal Details</Text>
        <View style={{ width: 40 }} /> {/* Spacer to keep title centered */}
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Render Annotated Image */}
        {entry.recognition?.annotatedImage ? (
          <Image 
            source={{ uri: entry.recognition.annotatedImage }} 
            style={styles.foodImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.foodImage, styles.imagePlaceholder]}>
             <Ionicons name="fast-food" size={50} color={COLORS.muted} />
          </View>
        )}

        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{entry.recognition?.name || "Custom Meal"}</Text>
            <View style={styles.dateRow}>
              <Ionicons name="time-outline" size={14} color={COLORS.muted} />
              <Text style={styles.dateText}>
                {entry.eatenAt ? new Date(entry.eatenAt).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) : 'Recent Meal'}
              </Text>
            </View>
          </View>
          
          <View style={[styles.badge, { backgroundColor: safety.isSafe !== false ? COLORS.primaryLight : "#fee2e2" }]}>
            <Text style={{ color: safety.isSafe !== false ? COLORS.primary : COLORS.danger, fontWeight: "700", fontSize: 12 }}>
              {safety.isSafe !== false ? "✓ SAFE" : "⚠ CAUTION"}
            </Text>
          </View>
        </View>

        {/* Macros Grid */}
        <View style={styles.statsGrid}>
          <StatBox label="Calories" value={`${Math.round(n.caloriesKcal || 0)}`} unit="kcal" />
          <StatBox label="Protein" value={`${n.proteinG || 0}`} unit="g" />
          <StatBox label="Carbs" value={`${n.carbsG || 0}`} unit="g" />
          <StatBox label="Sugar" value={`${n.sugarG || 0}`} unit="g" />
        </View>

        {/* AI Insights Section */}
        {insights.benefits && insights.benefits.length > 0 && (
          <Section title="Health Benefits" icon="leaf">
            {insights.benefits.map((b, i) => (
              <View key={i} style={styles.bulletRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                <Text style={styles.bulletText}>{b}</Text>
              </View>
            ))}
          </Section>
        )}

        {/* Safety Section */}
        {(safety.allergensMatched?.length || safety.warnings?.length) ? (
          <Section title="Safety & Allergens" color={COLORS.danger} icon="alert-circle">
            {safety.allergensMatched?.map((a, i) => (
              <Text key={i} style={styles.warningText}>• Contains: {a}</Text>
            ))}
            {safety.warnings?.map((w, i) => (
              <Text key={i} style={styles.warningText}>• {w}</Text>
            ))}
          </Section>
        ) : (
          <View style={styles.safeContainer}>
             <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
             <Text style={styles.safeNote}>No personal allergens detected.</Text>
          </View>
        )}

        {/* Micronutrients */}
        {(n.vitamins?.length || n.minerals?.length) ? (
          <Section title="Micronutrients" icon="flask">
            <View style={styles.microGrid}>
              {n.vitamins?.map((v, i) => (
                <Text key={`v-${i}`} style={styles.microItem}>{v.name}: {v.amount}{v.unit}</Text>
              ))}
              {n.minerals?.map((m, i) => (
                <Text key={`m-${i}`} style={styles.microItem}>{m.name}: {m.amount}{m.unit}</Text>
              ))}
            </View>
          </Section>
        ) : null}

      </ScrollView>
    </SafeAreaView>
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

const Section = ({ title, children, color = COLORS.text, icon }: any) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={20} color={color} style={{ marginRight: 8 }} />
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  navTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  container: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  foodImage: { width: '100%', height: 250, borderRadius: 24, marginBottom: 25 },
  imagePlaceholder: { backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 28, fontWeight: "900", color: COLORS.text, letterSpacing: -0.5 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  dateText: { color: COLORS.muted, fontSize: 14, marginLeft: 4, fontWeight: '500' },
  badge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statBox: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 20, alignItems: 'center', width: '23%', borderWidth: 1, borderColor: '#f1f5f9' },
  statValue: { fontSize: 20, fontWeight: '900', color: COLORS.text },
  statLabel: { fontSize: 10, color: COLORS.muted, fontWeight: '600', textTransform: 'uppercase' },
  statUnderline: { height: 3, width: 20, backgroundColor: COLORS.primary, borderRadius: 2, marginVertical: 6 },
  statName: { fontSize: 11, color: COLORS.text, fontWeight: '700' },
  section: { marginBottom: 30, backgroundColor: '#fff' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 19, fontWeight: "800" },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, backgroundColor: COLORS.primaryLight, padding: 12, borderRadius: 12 },
  bulletText: { fontSize: 15, color: COLORS.primaryDark, marginLeft: 10, flex: 1, fontWeight: '600', lineHeight: 20 },
  warningText: { color: COLORS.danger, fontSize: 15, marginBottom: 8, fontWeight: '600', paddingLeft: 4 },
  safeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primaryLight, padding: 12, borderRadius: 12, marginBottom: 20 },
  safeNote: { color: COLORS.primary, fontWeight: '700', marginLeft: 8, fontSize: 14 },
  microGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  microItem: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, fontSize: 13, color: COLORS.text, fontWeight: '600' }
});