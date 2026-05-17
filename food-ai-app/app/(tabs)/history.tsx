import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Animated,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFoodStore } from "../../store/foodStore";
import { SafeAreaView } from "react-native-safe-area-context";
import HistoryGraph from "../../components/HistoryGraph"; 

const API_URL = process.env.EXPO_PUBLIC_API_URL;

function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.8, duration: 1000, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={[styles.skeletonCard, { opacity }]}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonText} />
        <View style={styles.skeletonSmall} />
      </View>
    </Animated.View>
  );
}

export default function HistoryScreen() {

  const { foods, setFoods, needsRefresh, setNeedsRefresh } = useFoodStore();
  
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("today");
  const [filterLoading, setFilterLoading] = useState(false);

  const fetchHistory = async (filterType = activeFilter, isInitial = false) => {
    try {
      if (isInitial && foods.length === 0) setLoading(true);
      else setFilterLoading(true);

      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/food/history?filter=${filterType}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFoods(res.data.items || []);
      setActiveFilter(filterType);
      
      // Reset the refresh flag after a successful fetch
      if (setNeedsRefresh) setNeedsRefresh(false);
      
    } catch (err) {
      console.log("HISTORY ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
      setFilterLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchHistory(activeFilter, true);
  }, []);

  useEffect(() => {
    if (needsRefresh) {
      fetchHistory(activeFilter);
    }
  }, [needsRefresh]);

  const handleFilterChange = (type) => {
    if (type !== activeFilter) {
      fetchHistory(type); 
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory(activeFilter);
  };

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => router.push(`/food/${item.id || item._id}`)}
    >
      <Image
        source={{
          uri: item.annotatedImage
            ? item.annotatedImage.startsWith("data:")
              ? item.annotatedImage
              : `data:image/jpeg;base64,${item.annotatedImage}`
            : "https://via.placeholder.com/100",
        }}
        style={styles.image}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>{item.name || "Unknown Meal"}</Text>
        <Text style={styles.calories}>{item.calories || 0} kcal</Text>
        <Text style={styles.date}>
          {item.eatenAt ? new Date(item.eatenAt).toDateString() : ""}
        </Text>
      </View>
    </TouchableOpacity>
  ), []);

  if (loading && foods.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Meal History</Text>
        <View style={styles.filterContainer}>
          {[1, 2, 3, 4].map((i) => <View key={i} style={styles.loadingFilter} />)}
        </View>
        {[1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={foods}
        keyExtractor={(item) => (item.id || item._id).toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.heading}>Meal History</Text>

            <View style={styles.filterContainer}>
              {["all", "today", "week", "month"].map((type) => (
                <TouchableOpacity
                  key={type}
                  disabled={filterLoading}
                  onPress={() => handleFilterChange(type)}
                  style={[styles.filterBtn, activeFilter === type && styles.activeFilterBtn]}
                >
                  {filterLoading && activeFilter === type ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={[styles.filterText, activeFilter === type && styles.activeFilterText]}>
                      {type.toUpperCase()}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <HistoryGraph data={foods} filter={activeFilter} />

            {foods.length > 0 && (
              <Text style={styles.subHeading}>Recent Logs</Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>No meals found</Text>
            <Text style={styles.emptyText}>Your scanned meals will appear here.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const PRIMARY = "#16a34a";
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7fff9", paddingHorizontal: 16 },
  heading: { fontSize: 30, fontWeight: "800", color: "#14532d", marginTop: 10, marginBottom: 18 },
  subHeading: { fontSize: 18, fontWeight: "700", color: "#14532d", marginVertical: 15 },
  filterContainer: { flexDirection: "row", gap: 10, marginBottom: 10 },
  filterBtn: { flex: 1, paddingVertical: 10, borderRadius: 14, backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#d1fae5", alignItems: "center", justifyContent: "center" },
  activeFilterBtn: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  filterText: { fontSize: 11, fontWeight: "700", color: "#64748b" },
  activeFilterText: { color: "#fff" },
  loadingFilter: { flex: 1, height: 42, borderRadius: 14, backgroundColor: "#e5e5e5" },
  card: { flexDirection: "row", backgroundColor: "#ffffff", borderRadius: 18, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: "#ecfdf5", elevation: 3 },
  image: { width: 85, height: 85, borderRadius: 16, marginRight: 14 },
  name: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  calories: { marginTop: 5, fontSize: 15, color: PRIMARY, fontWeight: "700" },
  date: { marginTop: 8, color: "#94a3b8", fontSize: 12 },
  emptyContainer: { paddingTop: 50, alignItems: "center" },
  emptyEmoji: { fontSize: 60, marginBottom: 10 },
  emptyTitle: { fontSize: 22, fontWeight: "800", color: "#14532d" },
  emptyText: { marginTop: 6, color: "#64748b", textAlign: "center" },
  skeletonCard: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 18, padding: 12, marginBottom: 14 },
  skeletonImage: { width: 85, height: 85, borderRadius: 16, backgroundColor: "#e5e5e5", marginRight: 14 },
  skeletonContent: { flex: 1, justifyContent: "center" },
  skeletonTitle: { width: "70%", height: 18, borderRadius: 8, backgroundColor: "#e5e5e5", marginBottom: 12 },
  skeletonText: { width: "40%", height: 14, borderRadius: 8, backgroundColor: "#ececec", marginBottom: 10 },
  skeletonSmall: { width: "55%", height: 12, borderRadius: 8, backgroundColor: "#f0f0f0" },
});