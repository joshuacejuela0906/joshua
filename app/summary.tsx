import React, { useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Summary() {
  const params = useLocalSearchParams();
  const history = params.results ? JSON.parse(params.results as string) : [];
  const score = parseInt(params.finalScore as string || "0");
  const total = parseInt(params.total as string || "1");
  const category = params.category as string;
  const percentage = (score / total) * 100;

  useEffect(() => {
    if (category === "Your Deck") {
      updateLastScores();
    }
  }, []);

  const updateLastScores = async () => {
    try {
      const data = await AsyncStorage.getItem("flashcards");
      if (!data) return;

      let cards = JSON.parse(data);
      const resultsMap = new Map(history.map((h: any) => [h.id, h.isCorrect]));

      const updated = cards.map((card: any) => {
        if (resultsMap.has(card.id)) {
          return { 
            ...card, 
            lastScore: resultsMap.get(card.id) ? "Correct" : "Incorrect" 
          };
        }
        return card;
      });

      await AsyncStorage.setItem("flashcards", JSON.stringify(updated));
    } catch (e) { 
      console.log("Update Error:", e); 
    }
  };

  const getFeedback = () => {
    if (percentage === 100) return "Perfect Score! 🌟";
    if (percentage >= 70) return "Great Job! 👍";
    return "Keep Practicing! 💪";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
            <Text style={styles.headerTitle}>Review</Text>
            <Text style={styles.feedback}>{getFeedback()}</Text>
        </View>
        <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score} / {total}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {history.map((item: any, index: number) => (
          <View key={index} style={styles.card}>
            <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
              <Ionicons 
                name={item.isCorrect ? "checkmark-circle" : "close-circle"} 
                size={22} 
                color={item.isCorrect ? "#4CAF50" : "#FF5252"} 
              />
              <Text style={styles.qText}>{item.question}</Text>
            </View>
            <View style={styles.ansRow}>
              <Text style={styles.label}>
                You: <Text style={{color: item.isCorrect ? '#4CAF50' : '#FF5252', fontWeight: 'bold'}}>{item.userAnswer}</Text>
              </Text>
              {!item.isCorrect && (
                <Text style={styles.label}>
                  Correct: <Text style={{color: '#4CAF50', fontWeight: 'bold'}}>{item.correctAnswer}</Text>
                </Text>
              )}
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.btn} onPress={() => router.replace("/home")}>
          <Text style={styles.btnText}>Return Home</Text>
        </TouchableOpacity>
        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB", padding: 20 },
  header: { marginTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  feedback: { color: '#777', fontSize: 14, marginTop: 2 },
  scoreBadge: { backgroundColor: '#5A67F2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  scoreText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 20, marginBottom: 12, elevation: 1 },
  qText: { fontWeight: 'bold', fontSize: 16, marginLeft: 10, flex: 1, color: '#333' },
  ansRow: { marginTop: 12, paddingLeft: 32 },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  btn: { backgroundColor: '#5A67F2', padding: 18, borderRadius: 15, marginTop: 20, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});