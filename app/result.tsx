import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Result() {
  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
      <Text style={styles.title}>Study Complete!</Text>
      <Text style={styles.text}>You've mastered these cards today.</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.replace("/home")}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F7FB", padding: 20 },
  title: { fontSize: 28, color: "#333", fontWeight: "bold", marginTop: 20 },
  text: { fontSize: 16, color: "#777", marginVertical: 20, textAlign: "center" },
  button: { backgroundColor: "#5A67F2", padding: 18, width: "100%", borderRadius: 15 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});