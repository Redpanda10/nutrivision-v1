import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "../../lib/api";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY = "#16a34a";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage(null);
      setIsError(false);
      
      await api.post("/api/auth/forgot-password", { email });
      
      setIsError(false);
      setMessage("If this email is registered, a reset link/OTP has been sent.");
    } catch (error) {
      setIsError(true);
      setMessage(error?.response?.data?.message || "Failed to request reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#14532d" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Reset Password 🔑</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {message && (
            <View style={[styles.messageContainer, isError ? styles.errorBg : styles.successBg]}>
              <Text style={[styles.messageText, isError ? styles.errorText : styles.successText]}>
                {message}
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator color={PRIMARY} size="large" />
            ) : (
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Send Reset Link</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/reset-password")}
            style={styles.footerLink}
          >
            <Text style={styles.linkText}>
              Already have a token? <Text style={styles.linkHighlight}>Reset password</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fff9",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    marginTop: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#14532d",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 24,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
    color: "#1f2937",
    marginBottom: 16,
  },
  messageContainer: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  successBg: { backgroundColor: "#dcfce7" },
  successText: { color: "#166534" },
  errorBg: { backgroundColor: "#fee2e2" },
  errorText: { color: "#991b1b" },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  footerLink: {
    marginTop: 25,
    alignItems: "center",
  },
  linkText: {
    fontSize: 15,
    color: "#4b5563",
  },
  linkHighlight: {
    color: PRIMARY,
    fontWeight: "700",
  },
});