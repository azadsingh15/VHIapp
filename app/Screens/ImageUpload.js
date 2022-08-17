import React, { useState } from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import client from "../api/client";
import { StackActions } from "@react-navigation/native";
import UploadProgress from "../Screens/UploadProgress";
import { useLogin } from "../context/LoginProvider";
const ImageUpload = (props) => {
  const [profileImage, setProfileImage] = useState("");
  const [progress, setProgress] = useState(0);
  const { setIsLoggedIn, setProfile } = useLogin();
  const { token } = props.route.params;
  const openImageLibrary = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    } else {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });
      if (!response.cancelled) {
        setProfileImage(response.uri);
      }
    }
  };
  const uploadProfileImage = async () => {
    const formData = new FormData();
    formData.append("profile", {
      name: new Date() + "_profile",
      uri: profileImage,
      type: "image/jpg",
    });
    //console.log(formData)
    try {
      const res = await client.post("/upload-profile", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          authorization: `JWT ${token}`,
        },
        onUploadProgress: ({ loaded, total }) => setProgress(loaded / total),
      });
      console.log(res.data);
      if (res.data.success) {
        setProfile(res.data.user);
        setIsLoggedIn(true);
        props.navigation.dispatch(StackActions.replace("MainNavigator"));
      }
    } catch (error) {
      console.log("ERR");
    }
  };
  return (
    <>
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            onPress={openImageLibrary}
            style={styles.uploadBtnContainer}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Text style={styles.uploadBtn}>Upload Profile Image</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.skip}>Skip</Text>

          {profileImage ? (
            <TouchableOpacity onPress={uploadProfileImage}>
              <Text
                style={[
                  styles.skip,
                  { backgroundColor: "green", color: "white", borderRadius: 8 },
                ]}
              >
                Upload
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {progress ? <UploadProgress process={progress} /> : null}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadBtnContainer: {
    height: 125,
    width: 125,
    borderRadius: 125 / 2,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    overflow: "hidden",
  },
  uploadBtn: {
    textAlign: "center",
    fontSize: 16,
    opacity: 0.3,
    fontWeight: "bold",
  },
  skip: {
    textAlign: "center",
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    opacity: 0.5,
  },
});

export default ImageUpload;
