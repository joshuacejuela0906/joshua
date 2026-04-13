import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { QUESTION_DATA } from "./study";

export default function QuizScreen() {
  const params = useLocalSearchParams();
  const category = (params.category as string) || "Animals";
  const isTimed = params.isTimed === "true"; 

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isTimesUp, setIsTimesUp] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      if (category === "Your Deck") {
        const data = await AsyncStorage.getItem("flashcards");
        if (data) {
          const userCards = JSON.parse(data);
          
          // Get a pool of all possible answers to use as "Wrong" choices
          const allAnswers = userCards.map((c: any) => c.answer);

          const formatted = userCards.map((c: any) => {
            // Filter out the correct answer so it's not a duplicate wrong option
            const otherAnswers = allAnswers.filter((a: string) => a !== c.answer);
            
            // Randomly pick up to 3 distractors from your other cards
            const distractors = otherAnswers
              .sort(() => Math.random() - 0.5)
              .slice(0, 3);

            // Fill in the gaps if the user has fewer than 4 cards total
            while (distractors.length < 3) {
              distractors.push(`Option ${distractors.length + 2}`);
            }

            const options = [c.answer, ...distractors].sort(() => Math.random() - 0.5);
            return { 
              q: c.question, 
              options, 
              correct: options.indexOf(c.answer) 
            };
          });
          setQuestions(formatted);
        }
      } else {
        setQuestions(QUESTION_DATA[category] || []);
      }
      setLoading(false);
    };
    init();
  }, [category]);

  // TIMER LOGIC
  useEffect(() => {
    if (!isTimed || loading || questions.length === 0 || isTimesUp) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimesUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimed, loading, questions, isTimesUp]);

  const handleTimesUp = () => {
    setIsTimesUp(true);
    setTimeout(() => {
      finishQuiz(history, score);
    }, 2000);
  };

  const saveHighScore = async (finalScore: number) => {
    const key = `highScore_${category}`;
    const saved = await AsyncStorage.getItem(key);
    if (!saved || finalScore > parseInt(saved)) {
      await AsyncStorage.setItem(key, finalScore.toString());
    }
  };

  const finishQuiz = async (finalHistory: any[], finalScore: number) => {
    await saveHighScore(finalScore);
    router.replace({
      pathname: "/summary", 
      params: {
        results: JSON.stringify(finalHistory),
        finalScore: finalScore.toString(),
        total: questions.length.toString(),
        category: category, // Passed to Summary to allow "Last Score" updates
      },
    });
  };

  const handleAnswer = (index: number) => {
    if (selectedAns !== null || isTimesUp) return;
    
    const currentQuestion = questions[currentIdx];
    const isCorrect = index === currentQuestion.correct;
    const newHistory = [...history, { 
        question: currentQuestion.q, 
        userAnswer: currentQuestion.options[index], 
        correctAnswer: currentQuestion.options[currentQuestion.correct],
        isCorrect 
    }];
    
    const nextScore = isCorrect ? score + 1 : score;
    setScore(nextScore);
    setHistory(newHistory);
    setSelectedAns(index);

    setTimeout(() => {
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(currentIdx + 1);
        setSelectedAns(null);
      } else {
        finishQuiz(newHistory, nextScore);
      }
    }, 600);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#5A67F2" /></View>;

  return (
    <View style={styles.container}>
      {isTimesUp && (
        <View style={styles.timesUpOverlay}>
          <MaterialCommunityIcons name="alarm-snooze" size={80} color="#fff" />
          <Text style={styles.timesUpText}>TIME'S UP!</Text>
          <Text style={styles.timesUpSub}>Saving your progress...</Text>
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="close" size={28} /></TouchableOpacity>
        {isTimed && (
          <View style={[styles.timerBadge, { backgroundColor: timeLeft <= 10 ? '#FF5252' : '#5A67F2' }]}>
            <Text style={styles.timerText}>{timeLeft}s</Text>
          </View>
        )}
        <Text style={styles.progress}>{currentIdx + 1}/{questions.length}</Text>
      </View>

      <View style={styles.qCard}>
        <Text style={styles.qText}>{questions[currentIdx]?.q}</Text>
      </View>

      <ScrollView style={{ marginTop: 20 }}>
        {questions[currentIdx]?.options.map((opt: string, i: number) => (
          <TouchableOpacity 
            key={i} 
            onPress={() => handleAnswer(i)}
            disabled={selectedAns !== null || isTimesUp}
            style={[
              styles.optBtn, 
              selectedAns !== null && i === questions[currentIdx].correct && { backgroundColor: '#E8F5E9', borderColor: '#4CAF50' },
              selectedAns === i && i !== questions[currentIdx].correct && { backgroundColor: '#FFEBEE', borderColor: '#FF5252' }
            ]}
          >
            <Text style={styles.optTxt}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB", padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timerBadge: { paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 },
  timerText: { color: '#fff', fontWeight: 'bold' },
  progress: { fontWeight: 'bold', color: '#5A67F2' },
  qCard: { backgroundColor: '#fff', padding: 30, borderRadius: 20, marginTop: 20, elevation: 2 },
  qText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  optBtn: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 12, borderWidth: 2, borderColor: '#eee' },
  optTxt: { fontSize: 16, fontWeight: '600' },
  timesUpOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(90, 103, 242, 0.95)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timesUpText: { color: '#fff', fontSize: 40, fontWeight: '900', marginTop: 20 },
  timesUpSub: { color: '#fff', opacity: 0.8, fontSize: 16, marginTop: 10 }
});