import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Title from "./Title";
import BlockCard from "./BlockCard";

const VerticalList = ({ data, navigation }) => {
  return (
    <View>
      <View style={styles.container}>
        {data.map((item) => (
          <BlockCard item={item} key={item._id} navigation={navigation} />
        ))}
      </View>
    </View>
  );
};
export default VerticalList;
const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
});
