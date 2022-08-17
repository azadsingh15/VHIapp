import React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default UploadProgress=({process})=>{
  return (
    <View style={[StyleSheet.absoluteFillObject,styles.container]}>
      <LottieView progress={process} source={require('../assets/69672-progress-bar.json')} autoPlay loop/>
     </View>
  );
}

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.3)',
        zIndex:1,
    },
})
