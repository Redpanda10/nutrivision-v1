import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";

const PRIMARY = "#16a34a";

export default function Verify() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();

  const verifyEmail = useAuthStore((s) => s.verifyEmail);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);

  const [otp, setOtp] = useState("");

  const email = params.email ?? "";

  const handleVerify = async () => {
    try {
      await verifyEmail(email, otp);
      router.replace("/(onboarding)/health-profile");
    } catch (e: unknown) {
      const maybeAxiosMessage =
        typeof e === "object" &&
        e !== null &&
        "response" in e &&
        typeof (e as any).response === "object"
          ? (e as any).response?.data?.message
          : undefined;

      const msg =
        maybeAxiosMessage ||
        (e as any)?.message ||
        "Failed to verify email";

      Alert.alert("Error", msg);
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Email 📩</Text>
      <Text style={styles.subtitle}>
        Enter the OTP sent to your email
      </Text>

      <View style={styles.emailBox}>
        <Text style={styles.emailLabel}>Email</Text>
        <Text style={styles.emailText}>{email}</Text>
      </View>

      <TextInput
        placeholder="Enter OTP"
        placeholderTextColor="#7a7a7a"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator color={PRIMARY} />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={handleVerify}
        >
          <Text style={styles.buttonText}>Verify & Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  emailBox: {
    backgroundColor: "#ecfdf5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d1fae5",
  },

  emailLabel: {
    fontSize: 12,
    color: "#6b7280",
  },

  emailText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#14532d",
    marginTop: 2,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1fae5",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    textAlign: "center",
    fontSize: 16,
    letterSpacing: 4,
  },

  button: {
    backgroundColor: PRIMARY,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  error: {
    color: "#dc2626",
    marginBottom: 10,
    textAlign: "center",
  },
});