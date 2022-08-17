import React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default AppLoader=()=>{
  return (
    <View style={[StyleSheet.absoluteFillObject,styles.container]}>
      <LottieView source={require('../assets/72659-loader-vb.json')} autoPlay loop/>
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
