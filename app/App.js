import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { DrawerContent } from "./Screens/DrawerContent";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";
import MainTabScreen from "./Screens/MainTabScreen";
import RootStackScreen from "./Screens/RootStackScreen";
import { fetchAsyncQuestionPropertyQuestionProperty } from "inquirer/lib/utils/utils";
import ImageUpload from "./Screens/ImageUpload";
import LoginProvider from "./context/LoginProvider";
import MainNavigator from "./Screens/RootStackScreen";
import HomeScreen from "./Screens/HomeScreen";
import DocUploadForm from "./Screens/PostUpload/DocUploadForm";
import SinglePost from "./Screens/PostUpload/SinglePost";
import SingleImage from "./Screens/PostUpload/SingleImage";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const fetchApi = async () => {
    try {
      const res = await axios.get("http://192.168.1.5:3000/");
      console.log(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchApi();
  }, []);
  return (
    <LoginProvider>
      <NavigationContainer independent={true}>
        <MainNavigator />
      </NavigationContainer>
    </LoginProvider>
  );
  // return (
  //   <NavigationContainer independent={true}>
  //     <Stack.Navigator headerMode="none">
  //       <Stack.Screen
  //         name="SinglePost"
  //         component={SinglePost}
  //         options={{ headerShown: false }}
  //       />
  //       <Stack.Screen
  //         name="SingleImage"
  //         component={SingleImage}
  //         options={{
  //           headerTitle: "Image",
  //           headerTintColor: "white",
  //           headerStyle: { backgroundColor: "black" },
  //         }}
  //       />
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
