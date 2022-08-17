import React,{ useEffect } from 'react';
import { View, Text,Alert, TouchableOpacity,StyleSheet } from 'react-native';
import CompletionScreen from './CompletionScreen';
import SignInScreen from './SignInScreen';
import {StackActions} from '@react-navigation/native'
const RedirectScreen=({navigation})=> {
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('SignInScreen')
        }, 5000);
      }, []);
  return (
    <View style={styles.container}>
            <CompletionScreen />
      <Text style={styles.title}>SIGN UP COMPLETED!!</Text>
      <TouchableOpacity >
          <Text>Redirecting....</Text>
      </TouchableOpacity>
     </View>
  );
}
export default RedirectScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#009387',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        color: '#fff',
        fontSize: 30,
        paddingTop:350,
        fontWeight: 'bold',
    },
})
