import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "../../lib/api";

const PRIMARY = "#16a34a";

export default function ResetPassword() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage(null);

      await api.post("/api/auth/reset-password", {
        token,
        newPassword,
      });

      setMessage("Password reset successful. You can now log in.");
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ||
          "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password 🔐</Text>
      <Text style={styles.subtitle}>
        Enter your reset token and new password
      </Text>

      <TextInput
        placeholder="Reset token"
        placeholderTextColor="#7a7a7a"
        value={token}
        onChangeText={setToken}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="New password"
        placeholderTextColor="#7a7a7a"
        value={newPassword}
        secureTextEntry
        onChangeText={setNewPassword}
        style={styles.input}
      />

      {message ? (
        <Text
          style={[
            styles.message,
            message.includes("successful")
              ? styles.success
              : styles.error,
          ]}
        >
          {message}
        </Text>
      ) : null}

      {loading ? (
        <ActivityIndicator color={PRIMARY} />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}
      >
        <Text style={styles.link}>Back to login</Text>
      </TouchableOpacity>
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

  input: {
    borderWidth: 1,
    borderColor: "#d1fae5",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
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

  message: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 13,
  },

  success: {
    color: "#16a34a",
  },

  error: {
    color: "#dc2626",
  },

  link: {
    marginTop: 14,
    textAlign: "center",
    color: "#15803d",
  },
});