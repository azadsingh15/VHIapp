import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import Title from "./Title";
import Subtitle from "./Subtitle";
import { TouchableOpacity } from "react-native-gesture-handler";
import postsApi from "../../api/postsApi";

const BlockCard = ({ item, navigation }) => {
  const [singlePost, setSinglePost] = useState({});
  const { _id, user_id, display_name, image, desc, timestamp } = item;
  let nameParts = image.split(".");
  let fileType = nameParts[nameParts.length - 1];

  const displaySinglePost = async () => {
    //console.log(_id, user_id);
    const SinglePost = await postsApi.getSingle(user_id, _id);
    setSinglePost({ SinglePost: SinglePost });
    callfunction();
  };
  // useEffect(() => {
  //   return () => {
  //     callfunction();
  //   };
  // }, [singlePost]);
  const callfunction = async () => {
    console.log(singlePost);
    if (Object.keys(singlePost).length !== 0) {
      navigation.navigate("SinglePost", {
        singlePost: singlePost,
      });
    }
  };
  return (
    <TouchableOpacity onPress={displaySinglePost}>
      <View style={styles.container}>
        <Image
          source={{
            uri:
              fileType === "pdf"
                ? "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/400px-PDF_file_icon.svg.png"
                : image,
          }}
          style={styles.image}
        />
        <View style={styles.contentContainer}>
          <Title>{display_name}</Title>
          <Subtitle>{desc}</Subtitle>
          <Text>{timestamp}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default BlockCard;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
    height: 100,
  },
  image: {
    flex: 0.35,
    height: "100%",
  },
  contentContainer: {
    flex: 0.65,
    paddingHorizontal: 5,
  },
});
