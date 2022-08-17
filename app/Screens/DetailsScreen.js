import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Image,
  TextInput,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import postsApi from "../api/postsApi";
import client from "../api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";

const isValidObjField = (obj) => {
  return Object.values(obj).every((val) => val);
};

const DetailsScreen = () => {
  const [ImagePicked, setImage] = useState(null);
  const [document, setDocument] = useState(null);
  const [postInfo, setpostInfo] = useState({
    display_name: "",
    desc: "",
    image: "",
  });
  const [doc, setDoc] = useState();
  const [filetype, setfiletype] = useState(null);
  const [modal, setmodal] = useState(false);
  const { display_name, desc, image } = postInfo;

  const pickDocument = async () => {
    let data = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    }).then((response) => {
      if (response.type === "success") {
        let { name, size, uri } = response;
        let nameParts = name.split(".");
        let fileType = nameParts[nameParts.length - 1];
        var fileToUpload = {
          name: name,
          size: size,
          uri: "file://" + uri,
          type: "application/" + fileType,
        };
        console.log(fileToUpload, "..........file");
        setDoc(fileToUpload);
        setImage(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/400px-PDF_file_icon.svg.png"
        );
        setDocument(fileToUpload.uri);
        setfiletype("success");
      }
    });
  };

  const pickFromCamera = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (granted) {
      let data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });
      console.log(data);
      if (!data.cancelled) {
        setImage(data.uri);
        setDocument(data.uri);
        setfiletype(data.type);
      }
    } else {
      Alert.alert("you need to give up permission to work");
    }
  };

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
      });

      console.log(result);

      if (!result.cancelled) {
        setImage(result.uri);
        setDocument(result.uri);
        setfiletype(result.type);
      }
    } else {
      Alert.alert("you need to give permission to pick image");
    }
  };

  const isValidForm = () => {
    if (!isValidObjField(postInfo))
      Alert.alert("Required all fields!!", "Please fill all the fields.", [
        { text: "Okay" },
      ]);
    else {
      if (!display_name.trim() || display_name.length < 4)
        Alert.alert(
          "Required valid document name!!",
          "Please fill valid document name.",
          [{ text: "Okay" }]
        );
      if (!desc.trim() || desc.length < 4)
        Alert.alert(
          "Required valid description!!",
          "Please fill valid description.",
          [{ text: "Okay" }]
        );
    }
    return true;
  };
  const uploadImage = async () => {
    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();
    formData.append("post", {
      name: new Date() + "_post",
      uri: document,
      type: "image/jpg",
    });
    console.log(formData);
    try {
      const response = await client.post("/upload-post", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          authorization: `JWT ${token}`,
        },
      });
      if (response.data.success) {
        Alert.alert("Done!");
      }
      console.log(response.data);
    } catch (error) {
      console.log("Error in uploading doc", error);
    }
  };
  const uploadPdf = async () => {
    const token = await AsyncStorage.getItem("token");

    console.log(doc);
    const formData = new FormData();
    formData.append("document", doc);
    try {
      const response = await client.post("/upload-pdf", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          authorization: `JWT ${token}`,
        },
      });
      if (response.data.success) {
        Alert.alert("Done!");
      }
      console.log(response.data);
    } catch (error) {
      console.log("Error in uploading doc", error);
    }
  };
  const uploadPost = async () => {
    console.log(display_name, desc, image);
    if (isValidForm()) {
      try {
        const res = await postsApi.postDetails(display_name, desc);
        console.log(res.data);
        if (res.data.success) {
          if (filetype === "success") uploadPdf();
          else uploadImage();
        }
      } catch (error) {
        console.log("Error while uploading", error);
      }
    }
  };

  const submitDoc = () => {
    setmodal(false);
    if (document) {
      handleOnChangeText(document, "image");
    } else Alert.alert("Please Select a Document to Upload");
  };

  const handleOnChangeText = (val, fieldname) => {
    setpostInfo({ ...postInfo, [fieldname]: val });
    //console.log(val,fieldname);
  };

  const textInputChange = (val) => {
    handleOnChangeText(val, "display_name");
    setpostInfo({
      ...postInfo,
      display_name: val,
    });
  };
  const textInputChangeDesc = (val) => {
    handleOnChangeText(val, "desc");
    setpostInfo({
      ...postInfo,
      desc: val,
    });
  };
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text_footer}>Document Name</Text>
        <View style={styles.action}>
          <FontAwesome name="arrow-right" color="#05375a" size={20} />
          <TextInput
            value={display_name}
            placeholder="Document Name"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => textInputChange(val)}
          />
        </View>
        <Text style={[styles.text_footer, { marginTop: 35 }]}>Description</Text>
        <View style={styles.action}>
          <FontAwesome name="arrow-right" color="#05375a" size={20} />
          <TextInput
            value={desc}
            placeholder="Description"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => textInputChangeDesc(val)}
          />
        </View>
        <View style={styles.uploadBtnContainer}>
          {ImagePicked && (
            <Image
              source={{
                uri: ImagePicked ? ImagePicked : null,
              }}
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </View>
        <TouchableOpacity
          onPress={() => setmodal(true)}
          style={[
            styles.Picker,
            {
              borderColor: "#191970",
              borderWidth: 1,
              marginTop: 15,
            },
          ]}
        >
          <Text style={[styles.textSign2, { color: "#1f65ff" }]}>
            Select Document
          </Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            setmodal(false);
          }}
        >
          <View style={styles.modalView}>
            <View style={styles.modalButtonView}>
              <TouchableOpacity
                onPress={pickFromCamera}
                style={[
                  styles.PickerModal,
                  {
                    borderColor: "#191970",
                    borderWidth: 1,
                    // marginTop: 15,
                  },
                ]}
              >
                <Text style={[styles.textSign2, { color: "#1f65ff" }]}>
                  Camera
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={pickImage}
                style={[
                  styles.PickerModal,
                  {
                    borderColor: "#191970",
                    borderWidth: 1,
                    //marginTop: 15,
                  },
                ]}
              >
                <Text style={[styles.textSign2, { color: "#1f65ff" }]}>
                  Gallery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={pickDocument}
                style={[
                  styles.PickerModal,
                  {
                    borderColor: "#191970",
                    borderWidth: 1,
                    //padding: 5,
                  },
                ]}
              >
                <Text style={[styles.textSign2, { color: "#1f65ff" }]}>
                  Files
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cancelbutton}>
              <TouchableOpacity
                style={styles.cancel}
                onPress={() => setmodal(false)}
              >
                <LinearGradient
                  colors={["#1f65ff", "#191970"]}
                  style={styles.signIn}
                >
                  <Text style={[styles.textSign, { color: "#fff" }]}>
                    Cancel
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancel} onPress={submitDoc}>
                <LinearGradient
                  colors={["#1f65ff", "#191970"]}
                  style={styles.signIn}
                >
                  <Text style={[styles.textSign, { color: "#fff" }]}>
                    Confirm
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.button}>
          <TouchableOpacity style={styles.signIn} onPress={uploadPost}>
            <LinearGradient
              colors={["#1f65ff", "#191970"]}
              style={styles.signIn}
            >
              <Text style={[styles.textSign, { color: "#fff" }]}>Upload</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 20,
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#191970",
    fontWeight: "bold",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    paddingTop: 10,
    color: "#191970",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 70,
  },
  cancelbutton: {
    //alignItems: "center",
    flexDirection: "row",
    marginBottom: 40,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingTop: 10,
  },
  Picker: {
    width: "50%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingTop: 10,
    marginLeft: 75,
  },
  PickerModal: {
    width: "30%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingTop: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  textSign2: {
    fontSize: 15,
    fontWeight: "bold",
    paddingBottom: 10,
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
    marginTop: 20,
    marginLeft: 95,
  },
  modalView: {
    position: "absolute",
    bottom: 2,
    width: "100%",
    backgroundColor: "white",
  },
  modalButtonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 40,
  },
  cancel: {
    width: "40%",
    height: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingRight: 10,
    marginLeft: 30,
  },
});
