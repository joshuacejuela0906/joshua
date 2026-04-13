import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    await AsyncStorage.setItem("userName", name);
    await AsyncStorage.setItem("userEmail", email.toLowerCase());
    await AsyncStorage.setItem("userPassword", password);

    Alert.alert("Success", "Account created! Now log in.");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Us</Text>
      <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 30, backgroundColor: "#F5F7FB" },
  title: { fontSize: 32, fontWeight: "bold", color: "#5A67F2", textAlign: "center", marginBottom: 30 },
  input: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 15 },
  button: { backgroundColor: "#5A67F2", padding: 18, borderRadius: 12 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});