import { useEffect, useState } from "react";
import { router } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem("loggedIn");
        if (loggedIn === "true") {
          router.replace("/home");
        } else {
          router.replace("/login");
        }
      } catch (e) {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F7FB" }}>
        <ActivityIndicator size="large" color="#5A67F2" />
      </View>
    );
  }

  return null;
}