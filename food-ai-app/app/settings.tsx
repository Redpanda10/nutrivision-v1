import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
  ScrollView,
  Vibration,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const STORAGE_KEY = "hydration_reminder_settings";

export default function Settings() {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Initialize
  useEffect(() => {
    setupNotifications();
    loadSavedSettings();
  }, []);

  const setupNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Notice", "Notification permissions are required for reminders.");
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('hydration', {
        name: 'Hydration Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B82F6',
      });
    }
  };

  const loadSavedSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { enabled, time: savedTime } = JSON.parse(saved);
        setEnabled(enabled);
        setTime(new Date(savedTime));
      }
    } catch (e) {
      console.error("Failed to load settings");
    }
  };

  const syncSettings = async (newState: boolean, newTime: Date) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled: newState, time: newTime }));
      
      if (newState) {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "💧 Time to Hydrate!",
            body: "Keep your energy up. Grab a glass of water!",
            sound: true,
          },
          trigger: {
            hour: newTime.getHours(),
            minute: newTime.getMinutes(),
            repeats: true,
            channelId: 'hydration',
          },
        });
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    } catch (e) {
      Alert.alert("Error", "Could not update reminders");
    }
  };

  const onToggleReminder = (value: boolean) => {
    setEnabled(value);
    syncSettings(value, time);
    if (value) Vibration.vibrate(50);
  };

  const onTimeChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      setTime(selectedDate);
      syncSettings(enabled, selectedDate);
    }
  };

  const handleTest = async () => {
    await Notifications.scheduleNotificationAsync({
      content: { title: "🧪 Test Alert", body: "Your reminders are working perfectly!", sound: true },
      trigger: null,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* APP BAR */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* NOTIFICATIONS SECTION */}
        <Text style={styles.sectionLabel}>REMINDERS & NOTIFICATIONS</Text>
        <View style={styles.group}>
          <View style={styles.settingRow}>
            <View style={styles.rowLead}>
              <View style={[styles.iconWrap, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="notifications" size={20} color="#2563EB" />
              </View>
              <Text style={styles.settingText}>Daily Reminder</Text>
            </View>
            <Switch 
               value={enabled} 
               onValueChange={onToggleReminder}
               trackColor={{ false: "#cbd5e1", true: "#10b981" }}
            />
          </View>

          {enabled && (
            <TouchableOpacity style={styles.settingRow} onPress={() => setShowPicker(true)}>
              <View style={styles.rowLead}>
                <View style={[styles.iconWrap, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="time" size={20} color="#16a34a" />
                </View>
                <Text style={styles.settingText}>Reminder Time</Text>
              </View>
              <Text style={styles.valueText}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 0 }]} onPress={handleTest}>
            <View style={styles.rowLead}>
              <View style={[styles.iconWrap, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="flask" size={20} color="#475569" />
              </View>
              <Text style={styles.settingText}>Send Test Notification</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
          </TouchableOpacity>
        </View>

        {/* ACCOUNT SECTION */}
        <Text style={styles.sectionLabel}>PRIVACY & DATA</Text>
        <View style={styles.group}>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.rowLead}>
              <View style={[styles.iconWrap, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="shield-checkmark" size={20} color="#DC2626" />
              </View>
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomWidth: 0 }]}
            onPress={() => Alert.alert("Clear Data", "This will delete all history. Continue?", [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive", onPress: () => {} }
            ])}
          >
            <Text style={[styles.settingText, { color: '#DC2626' }]}>Clear All App Data</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerInfo}>App Version 2.0.4 • AI Health Assistant</Text>

      </ScrollView>

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          onChange={onTimeChange}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: { padding: 8, backgroundColor: '#fff', borderRadius: 12, elevation: 1 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  
  sectionLabel: { 
    fontSize: 12, 
    fontWeight: "700", 
    color: "#64748b", 
    marginLeft: 24, 
    marginTop: 24, 
    marginBottom: 8 
  },
  group: { 
    backgroundColor: "#fff", 
    marginHorizontal: 16, 
    borderRadius: 20, 
    overflow: "hidden",
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  rowLead: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: { padding: 8, borderRadius: 10 },
  settingText: { fontSize: 15, fontWeight: "600", color: "#334155" },
  valueText: { fontSize: 15, color: "#2563EB", fontWeight: "700" },
  footerInfo: { 
    textAlign: "center", 
    color: "#94a3b8", 
    fontSize: 12, 
    marginTop: 30, 
    marginBottom: 20 
  },
});