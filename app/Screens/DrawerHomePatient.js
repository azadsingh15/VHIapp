import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContent } from "./DrawerContent";
import { NavigationContainer } from "@react-navigation/native";

import MainTabScreen from "./MainTabScreen";
import SinglePost from "./PostUpload/SinglePost";
import SingleImage from "./PostUpload/SingleImage";

const RootStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerHomePatient = ({ navigation }) => (
  <NavigationContainer independent={true}>
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="HomeDrawer"
        component={MainTabScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="SinglePost"
        component={SinglePost}
        options={{ headerShown: false }}
        navigation={navigation}
      />
      <Drawer.Screen
        name="SingleImage"
        component={SingleImage}
        options={{
          headerTitle: "Image",
          headerTintColor: "white",
          headerStyle: { backgroundColor: "black" },
        }}
      />
    </Drawer.Navigator>
  </NavigationContainer>
);

export default DrawerHomePatient;
