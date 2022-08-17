import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import BlockCardDoc from "./BlockCardDoc";

const VerticalListDocs = ({ data, navigation }) => {
  return (
    <View>
      <View style={styles.container}>
        {data.map((item) => (
          <BlockCardDoc item={item} key={item._id} navigation={navigation} />
        ))}
      </View>
    </View>
  );
};
export default VerticalListDocs;
const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
});
