import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";

export default function Home() {
  const [cardCount, setCardCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const getCount = async () => {
        const data = await AsyncStorage.getItem("flashcards");
        if (data) setCardCount(JSON.parse(data).length);
      };
      getCount();
    }, [])
  );

  const logout = async () => {
    await AsyncStorage.removeItem("loggedIn");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={logout} style={styles.logoutContainer}>
        <Ionicons name="log-out-outline" size={20} color="#FF5252" />
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.welcomeSection}>
        <Text style={styles.title}>Hello there!</Text>
        <Text style={styles.subtitle}>You have <Text style={styles.highlight}>{cardCount} custom cards</Text> ready.</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{cardCount}</Text>
          <Text style={styles.statLabel}>Cards</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>4</Text>
          <Text style={styles.statLabel}>Topics</Text>
        </View>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/deck")}>
          <Ionicons name="layers-outline" size={26} color="#5A67F2" />
          <Text style={styles.navText}>My Deck</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mainButton} onPress={() => router.push("/study")}>
          <Ionicons name="play" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/addcard")}>
          <Ionicons name="add-circle-outline" size={28} color="#5A67F2" />
          <Text style={styles.navText}>Add Card</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB", padding: 30, justifyContent: 'center' },
  welcomeSection: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: "bold", color: "#333" },
  subtitle: { fontSize: 16, color: "#777", marginTop: 5 },
  highlight: { color: '#5A67F2', fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 50 },
  statBox: { backgroundColor: '#fff', width: '45%', padding: 20, borderRadius: 20, alignItems: 'center', elevation: 2 },
  statNum: { fontSize: 24, fontWeight: 'bold', color: '#5A67F2' },
  statLabel: { fontSize: 12, color: '#999', marginTop: 5, fontWeight: '700' },
  bottomNav: { position: "absolute", bottom: 40, left: 30, right: 30, backgroundColor: '#fff', padding: 15, borderRadius: 30, flexDirection: "row", justifyContent: "space-around", alignItems: "center", elevation: 10 },
  navItem: { alignItems: 'center' },
  navText: { color: "#5A67F2", fontWeight: "700", fontSize: 11, marginTop: 4 },
  mainButton: { backgroundColor: "#5A67F2", width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: -40, borderWidth: 6, borderColor: '#F5F7FB' },
  logoutContainer: { position: "absolute", top: 60, right: 20, flexDirection: 'row', alignItems: 'center' },
  logout: { color: "#FF5252", fontWeight: "600", marginLeft: 5 },
});