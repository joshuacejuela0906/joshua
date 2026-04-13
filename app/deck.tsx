import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated, PanResponder, Dimensions, Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

interface Card {
  id: string;
  question: string;
  answer: string;
  lastScore?: string;
  hidden?: boolean;
}

const SwipeableFlipCard = ({ item, onSwipe, onDelete }: { item: Card; onSwipe: (id: string) => void; onDelete: (id: string) => void }) => {
  const [flipped, setFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20,
      onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > SWIPE_THRESHOLD) {
          forceExit(gesture.dx > 0 ? "right" : "left");
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceExit = (direction: "left" | "right") => {
    Animated.timing(pan, {
      toValue: { x: direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipe(item.id));
  };

  const resetPosition = () => {
    Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
  };

  const handleFlip = () => {
    const toValue = flipped ? 0 : 180;
    Animated.spring(flipAnimation, { toValue, useNativeDriver: true, friction: 8 }).start();
    setFlipped(!flipped);
  };

  const frontInterpolate = flipAnimation.interpolate({ inputRange: [0, 180], outputRange: ["0deg", "180deg"] });
  const backInterpolate = flipAnimation.interpolate({ inputRange: [0, 180], outputRange: ["180deg", "360deg"] });

  return (
    <Animated.View style={[pan.getLayout(), styles.cardContainer]} {...panResponder.panHandlers}>
      <TouchableOpacity activeOpacity={1} onPress={handleFlip} style={styles.cardWrapper}>
        <Animated.View style={[styles.flipCard, styles.cardFront, { transform: [{ rotateY: frontInterpolate }], opacity: flipped ? 0 : 1 }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.label}>QUESTION</Text>
            <TouchableOpacity onPress={() => onDelete(item.id)}><Ionicons name="trash-outline" size={20} color="#FF5252" /></TouchableOpacity>
          </View>
          <Text style={styles.cardText}>{item.question}</Text>
          {item.lastScore && (
            <View style={[styles.scoreTag, { backgroundColor: item.lastScore === "Correct" ? "#E8F5E9" : "#FFEBEE" }]}>
              <Text style={[styles.scoreTagText, { color: item.lastScore === "Correct" ? "#4CAF50" : "#FF5252" }]}>Last: {item.lastScore}</Text>
            </View>
          )}
        </Animated.View>
        <Animated.View style={[styles.flipCard, styles.cardBack, { transform: [{ rotateY: backInterpolate }], opacity: flipped ? 1 : 0 }]}>
          <Text style={styles.labelBack}>ANSWER</Text>
          <Text style={styles.cardTextBack}>{item.answer}</Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function Deck() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => { loadCards(); }, []);

  const loadCards = async () => {
    const data = await AsyncStorage.getItem("flashcards");
    if (data) setCards(JSON.parse(data).map((c: Card) => ({ ...c, hidden: false })));
  };

  const deleteCard = (id: string) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", style: 'destructive', onPress: async () => {
        const updated = cards.filter(c => c.id !== id);
        setCards(updated);
        await AsyncStorage.setItem("flashcards", JSON.stringify(updated));
      }}
    ]);
  };

  const handleSwipe = (id: string) => setCards(prev => prev.map(c => c.id === id ? { ...c, hidden: true } : c));
  const resetDeck = () => setCards(prev => prev.map(c => ({ ...c, hidden: false })));
  const visibleCards = cards.filter(c => !c.hidden);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Study Deck</Text>
        <Text style={styles.countText}>{visibleCards.length} left</Text>
      </View>
      {visibleCards.length > 0 ? (
        <FlatList data={visibleCards} keyExtractor={(item) => item.id} renderItem={({ item }) => <SwipeableFlipCard item={item} onSwipe={handleSwipe} onDelete={deleteCard} />} />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-done-circle" size={80} color="#5A67F2" />
          <Text style={styles.emptyTitle}>All caught up!</Text>
          <TouchableOpacity style={styles.resetBtn} onPress={resetDeck}><Text style={styles.resetBtnText}>Refresh Deck</Text></TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB", padding: 20 },
  header: { marginTop: 40, flexDirection: "row", alignItems: "center", justifyContent: 'space-between', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#333" },
  countText: { color: '#5A67F2', fontWeight: 'bold' },
  cardContainer: { marginBottom: 20, height: 200 },
  cardWrapper: { flex: 1 },
  flipCard: { width: "100%", height: "100%", borderRadius: 25, padding: 20, backfaceVisibility: "hidden", position: "absolute", justifyContent: "center", alignItems: "center", elevation: 4 },
  cardFront: { backgroundColor: "#fff", borderLeftWidth: 10, borderLeftColor: "#5A67F2" },
  cardBack: { backgroundColor: "#5A67F2", transform: [{ rotateY: "180deg" }] },
  cardHeader: { position: 'absolute', top: 15, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 10, fontWeight: "800", color: "#5A67F2" },
  labelBack: { position: 'absolute', top: 15, fontSize: 10, color: "#fff" },
  scoreTag: { position: 'absolute', bottom: 15, right: 20, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  scoreTagText: { fontSize: 10, fontWeight: 'bold' },
  cardText: { fontSize: 20, fontWeight: "bold", textAlign: "center", color: '#333' },
  cardTextBack: { fontSize: 20, fontWeight: "bold", color: "#fff", textAlign: "center" },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 20, color: '#333' },
  resetBtn: { backgroundColor: '#5A67F2', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 15, marginTop: 30 },
  resetBtnText: { color: '#fff', fontWeight: 'bold' }
});