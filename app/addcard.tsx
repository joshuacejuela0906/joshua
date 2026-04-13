import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddCard() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const saveCard = async () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert("Missing Info", "Please provide both a question and an answer.");
      return;
    }

    setLoading(true);
    try {
      const existing = await AsyncStorage.getItem("flashcards");
      const cards = existing ? JSON.parse(existing) : [];
      
      const newCard = { 
        id: Date.now().toString(), // Unique ID
        question: question.trim(), 
        answer: answer.trim(),
        createdAt: new Date().toISOString() 
      };

      await AsyncStorage.setItem("flashcards", JSON.stringify([...cards, newCard]));
      
      // Optional: Add Haptics here if installed
      router.back();
    } catch (e) {
      Alert.alert("Error", "Could not save card.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Card</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>QUESTION</Text>
        <TextInput 
          placeholder="e.g., What is the capital of France?" 
          style={styles.input} 
          value={question} 
          onChangeText={setQuestion} 
          multiline 
        />

        <Text style={styles.label}>ANSWER</Text>
        <TextInput 
          placeholder="e.g., Paris" 
          style={[styles.input, { minHeight: 100 }]} 
          value={answer} 
          onChangeText={setAnswer} 
          multiline 
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, (!question || !answer) && styles.buttonDisabled]} 
        onPress={saveCard}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save to Deck</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB", padding: 20 },
  header: { marginTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 20, fontWeight: "800", color: "#333" },
  inputGroup: { backgroundColor: "#fff", padding: 20, borderRadius: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  label: { fontSize: 11, fontWeight: "800", color: "#5A67F2", marginBottom: 8, letterSpacing: 1 },
  input: { borderBottomWidth: 1, borderColor: "#eee", marginBottom: 25, paddingVertical: 10, fontSize: 16, color: '#333' },
  button: { backgroundColor: "#5A67F2", padding: 18, borderRadius: 15, marginTop: 'auto', marginBottom: 20, alignItems: "center" },
  buttonDisabled: { backgroundColor: '#A5ADF9' },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});