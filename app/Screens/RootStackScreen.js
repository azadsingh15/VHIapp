import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./SplashScreen";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";
import ImageUpload from "./ImageUpload";
import SingleImage from "./PostUpload/SingleImage";
import SinglePost from "./PostUpload/SinglePost";
import DrawerHomePatient from "./DrawerHomePatient";
import { useLogin } from "../context/LoginProvider";
import RedirectScreen from "./RedirectScreen";
import AppLoader from "./AppLoader";
import DrawerHomeDoctor from "./DrawerHomeDoctor";

const RootStack = createNativeStackNavigator();

const RootStackScreen = ({ navigation }) => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen
      name="SplashScreen"
      component={SplashScreen}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="SignInScreen"
      component={SignInScreen}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="SignUpScreen"
      component={SignUpScreen}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="ImageUpload"
      component={ImageUpload}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="MainNavigator"
      component={MainNavigator}
      options={{ headerShown: false }}
    />
    {/*<RootStack.Screen
      name="SinglePost"
      component={SinglePost}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="SingleImage"
      component={SingleImage}
      options={{
        headerTitle: "Image",
        headerTintColor: "white",
        headerStyle: { backgroundColor: "black" },
      }}
    />*/}
    {/*<RootStack.Screen name='RedirectScreen' component={RedirectScreen}   options={{headerShown: false}} />*/}
  </RootStack.Navigator>
);

const MainNavigator = () => {
  const { isLoggedIn, loginPending, profile } = useLogin();
  //console.log(isLoggedIn);
  //console.log(profile.role)
  return isLoggedIn ? (
    <>
      {profile.role == "Patient" ? <DrawerHomePatient /> : <DrawerHomeDoctor />}
    </>
  ) : (
    <RootStackScreen />
  );
};

export default MainNavigator;
