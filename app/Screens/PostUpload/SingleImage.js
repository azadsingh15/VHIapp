import React from "react";
import { Text, View, StatusBar, StyleSheet, Image } from "react-native";
import { Dimensions } from "react-native";

const SingleImage = ({ route, navigation }) => {
  // console.log("in");
  const { ImagePicked, imageDim } = route.params;
  //console.log(ImagePicked);
  //console.log(imageDim);
  const win = Dimensions.get("window");
  const ratio = win.width / imageDim.width;
  //console.log(win, ratio);
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: ImagePicked }}
        style={{
          height: imageDim.height * ratio,
          width: win.width,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "black",
  },
});

export default SingleImage;

{
  /*<View style={styles.container}>
      <Image
        source={{ uri: ImagePicked }}
        style={{
          height: imageDim.height * ratio,
          width: win.width,
        }}
      />
      </View>*/
}
