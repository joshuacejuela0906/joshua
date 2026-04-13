import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const savedEmail = await AsyncStorage.getItem("userEmail");
    const savedPassword = await AsyncStorage.getItem("userPassword");

    if (email && email === savedEmail && password === savedPassword) {
      await AsyncStorage.setItem("loggedIn", "true");
      router.replace("/home");
    } else {
      Alert.alert("Login failed", "Invalid email or password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to continue your progress</Text>

      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Don't have an account? <Text style={{fontWeight: 'bold'}}>Sign Up</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 30, backgroundColor: "#F5F7FB" },
  title: { fontSize: 32, fontWeight: "bold", color: "#5A67F2", textAlign: "center" },
  subtitle: { textAlign: 'center', color: '#777', marginBottom: 30 },
  input: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 15, elevation: 1 },
  button: { backgroundColor: "#5A67F2", padding: 18, borderRadius: 12, marginTop: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 },
  link: { color: "#5A67F2", textAlign: "center", marginTop: 20 },
});