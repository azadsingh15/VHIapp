import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DisplayDocs from "./DoctorsList/DisplayDocs";
import client from "../api/client";
import postsApi from "../api/postsApi";

const ProfileScreen = ({ navigation }) => {
  const [alldoctors, setalldoctors] = useState([]);

  const displayDocs = async () => {
    const alldoctors = await postsApi.getAllDoctors();
    setalldoctors(alldoctors);
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      displayDocs();
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <View style={styles.container}>
      <ScrollView>
        <DisplayDocs data={alldoctors} navigation={navigation} />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
{
  /*<View style={styles.container}>
        <DisplayDocs data={alldoctors} navigation={navigation} />
  </View>*/
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
});
