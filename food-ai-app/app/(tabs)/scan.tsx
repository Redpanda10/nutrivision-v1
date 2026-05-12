import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
  Modal,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../stores/authStore";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const COLORS = {
  primary: "#16a34a",
  primaryDark: "#14532d",
  background: "#f7fff9",
  card: "#ffffff",
  text: "#1e293b",
  muted: "#64748b",
  danger: "#dc2626",
  warning: "#f59e0b",
};

export default function ScanScreen() {
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { user } = useAuthStore();

  const [image, setImage] = useState<any>(null);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [foods, setFoods] = useState<any[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<any[]>([]);
  const [analysisMeta, setAnalysisMeta] = useState<any>(null); // For allergens/tips

//////////////////////


  const [expandedFoodId, setExpandedFoodId] = useState<string | null>(null);
  
  
  /* ================= CALCULATIONS ================= */

  const calc = (baseVal: number = 0, weight: string) => {
    const w = parseFloat(weight) || 0;
    return baseVal * (w / 100);
  };

  const totals = useMemo(() => {
    return selectedFoods.reduce(
      (acc, f) => ({
        calories: acc.calories + calc(f.nutrition?.caloriesKcal, f.userWeight || "100"),
        protein: acc.protein + calc(f.nutrition?.proteinG, f.userWeight || "100"),
        carbs: acc.carbs + calc(f.nutrition?.carbsG, f.userWeight || "100"),
        fat: acc.fat + calc(f.nutrition?.fatG, f.userWeight || "100"),
        sugar: acc.sugar + calc(f.nutrition?.sugarG, f.userWeight || "100"),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 }
    );
  }, [selectedFoods]);

  /* ================= MODAL STATE ================= */
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFood, setEditingFood] = useState<any>(null);
  const [weightInput, setWeightInput] = useState("100");


  /* ================= HANDLERS ================= */

  const scanFood = async () => {
    if (!image) return;
    console.log(image);
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", {
        uri: Platform.OS === "android" ? image.uri : image.uri.replace("file://", ""),
        name: "food.jpg",
        type: "image/jpeg",
      } as any);

      // console.log("message :",formData)

      const res = await axios.post(`${BASE_URL}/api/food/scan`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      setFoods(res.data.detectedFoods || []);
      setAnalysisMeta({
        allergens: res.data.allergens || [],
        tips: res.data.healthTips || [],
      });

      setDescription(res.data.detectedFoods||[]);

      console.log(description);

      console.log(res.data.allergens);
      
      if (res.data.annotatedImage) {
        setAnnotatedImage(res.data.annotatedImage);
      }
    } catch (err) {
      Alert.alert("Scan Error", "Unable to analyze food. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (food) => {
  setSelectedFoods((prev) => {
    const exists = prev.some((f) => f.id === food.id);

    if (exists) {
      const updated = prev.filter((f) => f.id !== food.id);
      console.log("UPDATED REMOVE:", updated);
      return updated;
    }

    const updated = [...prev, { ...food, userWeight: "100" }];
    console.log("UPDATED ADD:", updated);
    return updated;
  });

  };

  const updateWeight = () => {
    setSelectedFoods(prev => {
        const existing = prev.find(f => f.id === editingFood.id);
        if (existing) {
            return prev.map(f => f.id === editingFood.id ? { ...f, userWeight: weightInput } : f);
        }
        return [...prev, { ...editingFood, userWeight: weightInput }];
    });
    setModalVisible(false);
    Keyboard.dismiss();
  };
  const handleSaveMeal = async () => {
  if (!selectedFoods.length) return;

  const foodsToSend = [...selectedFoods];

  try {
    setSaving(true);

    const token = await AsyncStorage.getItem("token");

    const payload = {
      image: image?.uri,
      annotatedImage,
      selectedFoods: foodsToSend.map(f => ({
        foodId: f.id,
        name: f.name,
        weight: Number(f.userWeight) || 100,
        nutrition: f.nutrition,
      })),
      totals: {
        caloriesKcal: Number(totals.calories.toFixed(2)),
        proteinG: Number(totals.protein.toFixed(2)),
        carbsG: Number(totals.carbs.toFixed(2)),
        fatG: Number(totals.fat.toFixed(2)),
        sugarG: Number(totals.sugar.toFixed(2)),
      },
      createdAt: new Date().toISOString(),
    };

    await axios.post(`${BASE_URL}/api/food/save-meal`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    Alert.alert("Success", "Meal saved!");

    // clear AFTER success
    setSelectedFoods([]);
    setFoods([]);
    setImage(null);
    setAnnotatedImage(null);

    router.replace("/history");

  } catch (err) {
    console.error(err?.response?.data || err.message);
    Alert.alert("Error", "Save failed");
  } finally {
    setSaving(false);
  }
};
  return (
    
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=1964&auto=format&fit=crop' }} 
        style={StyleSheet.absoluteFillObject}
        blurRadius={10}
        resizeMode="cover"
      >
        


      <ScrollView contentContainerStyle={{ paddingBottom: 260 }}>
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
          <Text style={styles.headerTitle}>NutriVision AI</Text>
          <Text style={styles.headerSub}>AI-Powered Nutrient Detection</Text>
        </LinearGradient>

        

        {/* IMAGE PREVIEW AREA */}
        {!image ? (
          <View style={styles.uploadRow}>
            <TouchableOpacity style={styles.uploadCard} onPress={() => setCameraOpen(true)}>
              <Ionicons name="camera" size={32} color={COLORS.primary} />
              <Text style={styles.uploadText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadCard} onPress={async () => {
                let res = await ImagePicker.launchImageLibraryAsync({ quality: 1, allowsEditing: true });
                if (!res.canceled) setImage(res.assets[0]);
            }}>
              <Ionicons name="images" size={32} color={COLORS.primary} />
              <Text style={styles.uploadText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.previewBox}>
            <Image source={{ uri: annotatedImage || image.uri }} style={styles.previewImg} />
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setImage(null); setAnnotatedImage(null); setFoods([]); setSelectedFoods([]); setAnalysisMeta(null); }}>
                <Text style={{ color: COLORS.danger, fontWeight: "700" }}>Reset</Text>
              </TouchableOpacity>
              {!foods.length && (
                <TouchableOpacity style={styles.scanBtn} onPress={scanFood} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Analyze Food</Text>}
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ALLERGEN WARNINGS */}
        {analysisMeta?.allergens?.length > 0 && (
          <View style={styles.metaSection}>
            <Text style={styles.metaTitle}>⚠️ Allergen Alert</Text>
            <View style={styles.tagWrapper}>
              {analysisMeta.allergens.map((a: string, i: number) => (
                <View key={i} style={styles.allergenTag}><Text style={styles.tagText}>{a}</Text></View>
              ))}
            </View>
          </View>
        )}

        {/* DETECTED FOOD LIST */}
        {foods.map((item) => {
          const isSelected = selectedFoods.find((f) => f.id === item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.foodCard, isSelected && styles.activeCard]}
              onPress={() => { setEditingFood(item); setWeightInput(isSelected?.userWeight || "100"); setModalVisible(true); }}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodInfo}>
                   {isSelected ? `${isSelected.userWeight}g` : "100g base"} • {item.nutrition?.caloriesKcal} kcal/100g
                </Text>
              </View>
              <TouchableOpacity onPress={() => toggleSelect(item)}>
                <Ionicons
                  name={isSelected ? "checkmark-circle" : "add-circle-outline"}
                  size={32}
                  color={isSelected ? COLORS.primary : "#cbd5e1"}
                />
              </TouchableOpacity>
              
              <View >
                <Text style= {styles.descriptionText}>
                  Click me !  {item.description}
                  </Text>
                  </View>
            </TouchableOpacity>
            
          );
        })}
      </ScrollView>


      {/* STICKY MACRO FOOTER */}
      {selectedFoods.length > 0 && (
        
        <View style={styles.footer}>
          <View style={styles.macroRow}>
            <Macro val={totals.calories.toFixed(0)} label="Cals" />
            <Macro val={totals.protein.toFixed(2)} label="Protein" />
            <Macro val={totals.carbs.toFixed(2)} label="Carbs" />
            <Macro val={totals.fat.toFixed(2)} label="Fat" />
            <Macro val={totals.sugar.toFixed(2)} label="Sugar" />
          </View>
          <TouchableOpacity onPress={handleSaveMeal} style={styles.saveBtn}>
  {saving ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text style={styles.btnText}>Confirm Meal</Text>
  )}
</TouchableOpacity>
        </View>
        
      )}

      {/* PORTION ADJUST MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ width: "100%" }}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Adjust Portion</Text>
                <Text style={styles.modalSub}>{editingFood?.name}</Text>
                
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.weightInput}
                    keyboardType="numeric"
                    value={weightInput}
                    onChangeText={setWeightInput}
                    autoFocus
                  />
                  <Text style={styles.unit}>grams</Text>
                </View>

                <View style={styles.modalNutritionGrid}>
                  <ModalStat val={calc(editingFood?.nutrition?.caloriesKcal, weightInput).toFixed(0)} label="Kcal" />
                  <ModalStat val={calc(editingFood?.nutrition?.proteinG, weightInput).toFixed(1) + "g"} label="Protein" />
                  <ModalStat val={calc(editingFood?.nutrition?.carbsG, weightInput).toFixed(1) + "g"} label="Carbs" />
                  <ModalStat val={calc(editingFood?.nutrition?.fatG, weightInput).toFixed(1) + "g"} label="Fat" />
                </View>

                <TouchableOpacity style={styles.modalConfirm} onPress={updateWeight}>
                  <Text style={styles.btnText}>Apply Adjustment</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* CAMERA OVERLAY */}
      {cameraOpen && (
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill}>
          <TouchableOpacity style={styles.closeCam} onPress={() => setCameraOpen(false)}>
            <Ionicons name="close-circle" size={44} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shutter} onPress={async () => {
              const p = await cameraRef.current.takePictureAsync();
              setImage(p);
              setCameraOpen(false);
          }} />
        </CameraView>
      )}
      </ImageBackground>
    </View>
  );
}

const Macro = ({ val, label }: any) => (
  <>
  <View style={{ alignItems: "center" }}>
    <Text style={styles.macroVal}>{val}</Text>
    <Text style={styles.macroLabel}>{label}</Text>
  </View>
  </>
);

const ModalStat = ({ val, label }: any) => (

  <View style={styles.modalStat}>
    <Text style={styles.modalStatVal}>{val}</Text>
    <Text style={styles.modalStatLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  absoluteFillObject:{
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 30, paddingTop: 60, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, marginBottom: 20 },
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "900" },
  headerSub: { color: "#dcfce7", fontSize: 14, fontWeight: "600" },
  uploadRow: { flexDirection: "row", paddingHorizontal: 20, gap: 15 },
  uploadCard: { flex: 1, backgroundColor: "#fff", padding: 25, borderRadius: 24, alignItems: "center", elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
  uploadText: { marginTop: 10, fontWeight: "700", color: COLORS.text },
  previewBox: { paddingHorizontal: 20 },
  previewImg: { width: "100%", height: 260, borderRadius: 24, backgroundColor: "#e2e8f0" },
  btnRow: { flexDirection: "row", marginTop: 15, gap: 12 },
  cancelBtn: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1.5, borderColor: COLORS.danger, alignItems: "center" },
  scanBtn: { flex: 2, backgroundColor: COLORS.primary, padding: 16, borderRadius: 16, alignItems: "center", elevation: 4 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  metaSection: { marginHorizontal: 20, marginTop: 20, backgroundColor: "#fff", padding: 16, borderRadius: 20, borderWidth: 1, borderColor: "#fee2e2" },
  metaTitle: { fontWeight: "800", color: COLORS.danger, marginBottom: 10 },
  tagWrapper: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  allergenTag: { backgroundColor: "#fee2e2", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  tagText: { color: COLORS.danger, fontWeight: "700", fontSize: 12 },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
    textAlign: "justify",
    fontStyle: "italic", // Gives it a "curated" AI feel
  },
  foodCard: { backgroundColor: "#fff", marginHorizontal: 20, marginTop: 12, padding: 18, borderRadius: 22, flexDirection: "row", alignItems: "center", elevation: 2 },
  activeCard: { borderWidth: 2, borderColor: COLORS.primary, backgroundColor: "#f0fdf4" },
  foodName: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  foodInfo: { fontSize: 13, color: COLORS.muted, marginTop: 4 },
  footer: { position: "absolute",bottom:25, width: "100%",  paddingBottom: Platform.OS === "ios" ? 90 : 70,backgroundColor: "#fff", padding: 24, borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 20, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 15 },
  macroRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  macroVal: { fontSize: 20, fontWeight: "900", color: COLORS.text },
  macroLabel: { fontSize: 11, color: COLORS.muted, textTransform: "uppercase", fontWeight: "700", marginTop: 2 },
  saveBtn: { backgroundColor: COLORS.primary, padding: 20, borderRadius: 20, alignItems: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(20, 83, 45, 0.7)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28 },
  modalTitle: { fontSize: 22, fontWeight: "900", color: COLORS.text, textAlign: "center" },
  modalSub: { color: COLORS.primary, fontWeight: "800", fontSize: 17, textAlign: "center", marginTop: 5, marginBottom: 25 },
  inputContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 30, backgroundColor: "#f1f5f9", padding: 20, borderRadius: 24 },
  weightInput: { fontSize: 40, fontWeight: "900", color: COLORS.text, textAlign: "center", minWidth: 100 },
  unit: { fontSize: 20, marginLeft: 10, color: COLORS.muted, fontWeight: "700" },
  modalNutritionGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30, backgroundColor: "#f0fdf4", padding: 20, borderRadius: 20 },
  modalStat: { alignItems: "center", flex: 1 },
  modalStatVal: { fontSize: 18, fontWeight: "900", color: COLORS.text },
  modalStatLabel: { fontSize: 11, color: COLORS.muted, fontWeight: "700" },
  modalConfirm: { backgroundColor: COLORS.primary, padding: 20, borderRadius: 20, alignItems: "center" },
  closeCam: { position: "absolute", top: 60, right: 25 },
  shutter: { position: "absolute", bottom: 60, alignSelf: "center", width: 80, height: 80, borderRadius: 40, backgroundColor: "#fff", borderWidth: 6, borderColor: COLORS.primary },
});