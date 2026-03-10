import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Card from "./card";

export default function Index() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={true}
        >
          <Image
            source={require("../assets/images/joshua.jpg")}
            style={styles.profileImage}
          />
          
          <Text style={styles.name}>Joshua P. Cejuela</Text>
          <Text style={styles.bio}>
            Software enthusiast interested in AI, Data Science, and Mobile App
            Development.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Courses</Text>

            <Card
              title="React Native Development"
              description="Mobile app development using React Native."
            />
            <Card
              title="Data Science Fundamentals"
              description="Learn data analysis and machine learning basics."
            />
            <Card
              title="Cybersecurity Basics"
              description="Understand vulnerabilities and protection methods."
            />

            {/* Extra cards to demonstrate scrolling */}
            <Card
              title="UI/UX Design"
              description="Principles of user interface and experience design."
            />
            <Card
              title="Backend Development"
              description="Building APIs and server-side applications."
            />
            <Card
              title="Cloud Computing"
              description="Introduction to AWS and cloud services."
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
  
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  bio: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    color: "gray",
  },
  section: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",       
    marginBottom: 10,
  },
});
