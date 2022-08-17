import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from './DrawerContent';
import { NavigationContainer } from '@react-navigation/native';

import MainTabScreen from './MainTabScreen';
import DetailsScreen from './DetailsScreen';
const RootStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerHomeDoctor = ({navigation}) => (
    <NavigationContainer independent={true}> 
        <Drawer.Navigator drawerContent={props=><DrawerContent{...props}/>}>
          {/* {<Drawer.Screen name="HomeDrawer" component={MainTabScreen} options={{headerShown: false}} />} */}
          <Drawer.Screen name="Details" component={DetailsScreen} />
        </Drawer.Navigator>
      </NavigationContainer>

);

export default DrawerHomeDoctor;