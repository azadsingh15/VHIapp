import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import Title from "../PostUpload/Title";
import Subtitle from "../PostUpload/Subtitle";
import { TouchableOpacity } from "react-native-gesture-handler";
import postsApi from "../../api/postsApi";

const BlockCardDoc = ({ item, navigation }) => {
  const { name, email, address, avatar } = item;
  //console.log(avatar);
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <Image
          source={{
            uri:
              avatar === undefined
                ? "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                : avatar,
          }}
          style={styles.image}
        />
        <View style={styles.contentContainer}>
          <Title>{name}</Title>
          <Subtitle>{email}</Subtitle>
          <Text>{address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default BlockCardDoc;
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
