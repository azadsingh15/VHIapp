import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import postsApi from "../api/postsApi";
import BlockCard from "./PostUpload/BlockCard";
import DisplayPost from "./PostUpload/DisplayPost";
import data from "./PostUpload/fakeData";
import VerticalList from "./PostUpload/VerticalList";
import { useLogin } from "../context/LoginProvider";

const HomeScreen = ({ navigation }) => {
  const [allposts, setallposts] = useState([]);
  const { profile } = useLogin();

  const displayallposts = async () => {
    //console.log(profile);
    const allPosts = await postsApi.getAll(profile.user_id);
    //console.log(allPosts);
    setallposts(allPosts);
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      displayallposts();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView>
      <View>
        {allposts.length === 0 ? (
          <View style={styles.container}>
            <Text style={styles.textstyle}>No Posts Yet!</Text>
          </View>
        ) : (
          <DisplayPost data={allposts} navigation={navigation} />
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textstyle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 250,
  },
});
