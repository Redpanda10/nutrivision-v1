import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { Ionicons } from "@expo/vector-icons";

/* ================= NOTIFICATION CONFIG ================= */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Settings({ navigation }) {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [notificationId, setNotificationId] = useState(null);

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Enable notifications to use reminders");
    }
  };

  /* ================= SCHEDULE NOTIFICATION ================= */
  const scheduleReminder = async (selectedTime) => {
    await cancelReminder();

    const trigger = {
      hour: selectedTime.getHours(),
      minute: selectedTime.getMinutes(),
      repeats: true,
    };

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "💧 Hydration Reminder",
        body: "Drink water now! Stay healthy and hydrated 💙",
        sound: true,
      },
      trigger,
    });

    setNotificationId(id);
  };

  /* ================= CANCEL NOTIFICATION ================= */
  const cancelReminder = async () => {
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      setNotificationId(null);
    }
  };

  /* ================= TOGGLE ================= */
  const toggleSwitch = async (value) => {
    setEnabled(value);

    if (!value) {
      await cancelReminder();
    } else {
      await scheduleReminder(time);
    }
  };

  /* ================= TIME CHANGE ================= */
  const onChangeTime = async (event, selectedDate) => {
    const current = selectedDate || time;
    setShowPicker(Platform.OS === "ios");
    setTime(current);

    if (enabled) {
      await scheduleReminder(current);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Ionicons name="arrow-back" size={26} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* HYDRATION CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💧 Hydration Reminder</Text>

        <Text style={styles.subtitle}>
          Set a daily alarm to remind you to drink water
        </Text>

        {/* TIME DISPLAY */}
        <TouchableOpacity
          style={styles.timeBox}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.timeText}>
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Ionicons name="time-outline" size={22} color="#16a34a" />
        </TouchableOpacity>

        {/* TOGGLE */}
        <View style={styles.row}>
          <Text style={styles.label}>Enable Reminder</Text>
          <Switch value={enabled} onValueChange={toggleSwitch} />
        </View>

        <Text style={styles.hint}>
          🔔 You will receive a daily notification at this time
        </Text>
      </View>

      {/* TIME PICKER */}
      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onChangeTime}
        />
      )}
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0f172a",
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#14532d",
  },

  subtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 6,
    marginBottom: 15,
  },

  timeBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0fdf4",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 15,
  },

  timeText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },

  hint: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 10,
  },
});