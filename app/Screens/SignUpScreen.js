import React,{useState} from 'react';
import { StyleSheet, Text, View,Button,TouchableOpacity,Dimensions,Platform,TextInput, StatusBar, ScrollView, KeyboardAvoidingView,Alert } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import { RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import client from '../api/client';
import {StackActions} from '@react-navigation/native'
import { useLogin } from '../context/LoginProvider';
import AppLoader from './AppLoader';
import { signIn } from '../api/user';

const isValidObjField=(obj)=>{
    return Object.values(obj).every(val=>val)
}

const isValidEmail = (val) => {
    const regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return regx.test(val);
  };
  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() +
      1}/${date.getFullYear()}`;
  };  

const SignUpScreen = ({navigation}) =>{
    const [value, setValue] = React.useState('MALE');
    const [value2, setValue2] = React.useState('PATIENT');
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const {loginPending,setLoginPending}=useLogin()
    //const {setIsLoggedIn,setProfile}=useLogin();

    const [userInfo, setUserInfo]=React.useState({
        name:'',
        email:'',
        password:'',
        gender:'',
        age:'',
        dateOfBirth:'',
        address:'',
        role:'',
        check_textInputChange:false,
        secureTextEntry:true,
        isValidUser: true,
        isValidPassword: true,
        isValidAge:true,
        isValidAddress:true,
        isValidName:true
    });

    const {name,email,password,gender,age,dateOfBirth,address,role}=userInfo;


    const onChange = (event, selectedValue) => {
        setShow(Platform.OS === 'ios');
        if (mode == 'date') {
          const currentDate = selectedValue || new Date();
          setDate(currentDate);
          const formatedDate=formatDate(currentDate)
          handleOnChangeText(formatedDate, 'dateOfBirth') 
        }
        
      };
    const showMode = currentMode => {
        setShow(true);
        setMode(currentMode);
      };
    const showDatepicker = () => {
        showMode('date');
      };
    const handleOnChangeText= (val,fieldname)=>{
        setUserInfo({...userInfo,[fieldname]:val})
        //console.log(val,fieldname);
    };
    //console.log(userInfo);
    const isValidForm=()=>{
        //Checking if every field is filled
        if(!isValidObjField(userInfo))
            Alert.alert('Required all fields!!','Please fill all the fields.',[ {text:'Okay'}]);
        else{
        //if valid name with 2 or more characters
        if (!name.trim() || name.length < 2)
            Alert.alert('Required valid name!!','Please fill valid name.',[ {text:'Okay'}]);
        // if valid email with 3 or more characters
        if (!email.trim() || email.length < 4)
            Alert.alert('Required valid email!!','Please fill valid email.',[ {text:'Okay'}]);

        // only valid email id is allowed
        if (!isValidEmail(email)) 
            Alert.alert('Required valid email!!','Please fill valid email.',[ {text:'Okay'}]);
        // password must have 8 or more characters
        if (!password.trim() || password.length < 8)
            Alert.alert('Required valid password!!','Please fill a password that is more than 8 characters.',[ {text:'Okay'}]);
        //age must be a number between 10 to 100
        if (age<10||age>100)
            Alert.alert('Required valid age!!','Please fill age between 10 to 100',[ {text:'Okay'}]);
        if (!address.trim() || address.length < 8)
            Alert.alert('Required valid address!!','Please fill a address that is more than 8 characters.',[ {text:'Okay'}]);    
        }    
        return true;    
    }    

    const submitForm=async()=>{
        setLoginPending(true)
        if(isValidForm()){
            const res=await client.post('/create-user',{name,email,password,gender,age,dateOfBirth,address,role});
            //console.log(res.data)
            
            if(res.data.success){
                // setProfile(res.data.user);
                // setIsLoggedIn(true);
                const signInRes=await signIn(email,password);
                //console.log(signInRes);
                if(signInRes.data.success){
                navigation.dispatch(
                    StackActions.replace('ImageUpload', {
                      token:signInRes.data.token,
                    })
                )    
                }
            }
        }
        setLoginPending(false)
    }

    const textInputChange = (val) => {
        handleOnChangeText(val,'email')
        if( val.trim().length >= 4 ) {
            setUserInfo({
                ...userInfo,
                email: val,
                check_textInputChange: true,
                isValidUser:true
            });
        } else {
            setUserInfo({
                ...userInfo,
                email: val,
                check_textInputChange: false,
                isValidUser:false
            });
        }
    }  
    const handlePasswordChange=(val)=>{
        handleOnChangeText(val,'password');
        if(val.trim().length>=8){
            setUserInfo({
                ...userInfo,
                password:val,
                isValidPassword:true
            });
        }else{
            setUserInfo({
                ...userInfo,
                password:val,
                isValidPassword:false
            });
        }    
    }
    /*const handleValidUser=(val)=>{
        if(val.trim().length>=4)
        {
            setUserInfo({
                ...userInfo,
                isValidUser:true
            });
        }else{
            setUserInfo({
                ...userInfo,
                isValidUser:false
            });
        }
    }*/  
    const handleValidAge=(val)=>{
        handleOnChangeText(val,'age');
        if(val>=10 && val<=100)
        {
            setUserInfo({
                ...userInfo,
                age:val,
                isValidAge:true
            });
        }else{
            setUserInfo({
                ...userInfo,
                age:val,
                isValidAge:false
            });
        }
    }
    const handleValidAddress=(val)=>{
        handleOnChangeText(val,'address');
        if(val.trim().length>=8)
        {
            setUserInfo({
                ...userInfo,
                address:val,
                isValidAddress:true
            });
        }else{
            setUserInfo({
                ...userInfo,
                address:val,
                isValidAddress:false
            });
        }
    }
    const handleValidName=(val)=>{
        handleOnChangeText(val,'name');
        if(val.trim().length>=2)
        {
            setUserInfo({
                ...userInfo,
                name:val,
                isValidName:true
            });
        }else{
            setUserInfo({
                ...userInfo,
                name:val,
                isValidName:false
            });
        }
    }
    const updateSecureTextEntry=()=>{
        setUserInfo({
            ...userInfo,
            secureTextEntry:!userInfo.secureTextEntry
        });
    }
  return (
      <>
    <KeyboardAvoidingView style={styles.container}>
        <StatusBar backgroundColor="#009387" barStyle="light-content"/>
        
      <View style={styles.header}>
            <Text style={styles.text_header}>Register Here!</Text>
        </View>
        
        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView>
        <Text style={styles.text_footer}>Name</Text>
            <View style={styles.action}>
                <FontAwesome
                name="user-o"
                color="#05375a"
                size={20}
                />
                <TextInput
                value={name}
                placeholder="Your Full Name" 
                style={styles.textInput}
                onChangeText={(val)=>handleValidName(val)}
                />
            </View>
            {
                userInfo.isValidName?null:
            <Animatable.View animation="fadeInLeft" duration={500}>
             <Text style={styles.errorMsg}>Name must be 2 characters long.</Text>       
             </Animatable.View>
            }  
            
            <Text style={styles.text_footer}>Email</Text>
            <View style={styles.action}>
                <FontAwesome
                name="user-o"
                color="#05375a"
                size={20}
                />
                <TextInput
                value={email}
                placeholder="Your Email" 
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val)=>textInputChange(val)}
                /*onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}*/
                />
                {userInfo.check_textInputChange?
                <Animatable.View
                    animation="bounceIn"
                >
                <Feather
                name="check-circle"
                color="green"
                size={20}
                />
                </Animatable.View>
                :null}
            </View>
            {
                userInfo.isValidUser?null:
            <Animatable.View animation="fadeInLeft" duration={500}>
             <Text style={styles.errorMsg}>Username must be 4 characters long.</Text>       
             </Animatable.View>
            }  
            <Text style={[styles.text_footer,{marginTop:10}]}>Password</Text>
            <View style={styles.action}>
                <Feather
                name="lock"
                color="#05375a"
                size={20}
                />
                <TextInput
                value={password}
                placeholder="Your Password"
                secureTextEntry={userInfo.secureTextEntry?true:false}
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val)=>handlePasswordChange(val)}
                />
                <TouchableOpacity onPress={updateSecureTextEntry}>
                    {userInfo.secureTextEntry?
                    <Feather
                    name="eye-off"
                    color="grey"
                    size={20}
                    />
                    :
                    <Feather
                    name="eye"
                    color="grey"
                    size={20}
                    />
                    }
                </TouchableOpacity>
            </View>
            {   userInfo.isValidPassword? null:
            <Animatable.View animation="fadeInLeft" duration={500}>
             <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>       
             </Animatable.View>
            }
             <View>       
            <Text style={[styles.text_footer,{marginTop:10}]}>Gender</Text>
            <View style={styles.action}>
            <RadioButton.Group  onValueChange={val => {setValue(val);handleOnChangeText(val,'gender');}} value={value}>
            <View style={{flexDirection:'row'}}>
            <View style={{flexDirection:'row'}}>
                <Text style={{paddingTop:7}}>Male</Text>
                <RadioButton value="Male" />
            </View>
            <View style={{paddingHorizontal:20,flexDirection:'row'}}>
                <Text style={{paddingTop:7}}>Female</Text>
                <RadioButton value="Female" />
            </View>
            <View style={{paddingHorizontal:20,flexDirection:'row'}}>
                <Text style={{paddingTop:7}}>Other</Text>
                <RadioButton value="Other" />
            </View>
            </View>
            </RadioButton.Group>
            </View>
            </View>
            <Text style={[styles.text_footer,{marginTop:10}]}>Age</Text>
            <View style={[styles.action,{paddingTop:5}]}>
    
                <TextInput
                value={age}
                placeholder="Your Age" 
                style={styles.textInput}
                autoCapitalize="none"
                keyboardType = 'numeric'
                onChangeText={(val)=>handleValidAge(val)}
                />
            </View>
            
            {   userInfo.isValidAge? null:
            <Animatable.View animation="fadeInLeft" duration={500}>
             <Text style={styles.errorMsg}>Age must be between 10 to 100 years.</Text>       
             </Animatable.View>
            }
            <Text style={[styles.text_footer,{marginTop:10}]}>Date Of Birth</Text>
            <View style={[styles.action,{paddingTop:5}]}>
                <FontAwesome
                name="calendar"
                color="#05375a"
                size={20}
                onPress={showDatepicker}
                />
                {show && (
                    <DateTimePicker
                    testID='dateTimePicker'
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display='default'
                    onChange={onChange}
                    //onChange={(val)=>handleOnChangeText(val,'dateOfBirth')}
                    />
                )}
                <Text style={[styles.textInput,{paddingTop:10}]}>{formatDate(date)}</Text>
            </View>

            <Text style={[styles.text_footer,{marginTop:10}]}>Address</Text>
            <View style={[styles.action,{paddingTop:5}]}>
                <FontAwesome
                name="home"
                color="#05375a"
                size={20}
                />
                <TextInput
                value={address}
                placeholder="Your Address" 
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val)=>handleValidAddress(val)}
                />
                
            </View> 
            {   userInfo.isValidAddress? null:
            <Animatable.View animation="fadeInLeft" duration={500}>
             <Text style={styles.errorMsg}>Address must be 8 characters long.</Text>       
             </Animatable.View>
            }      
            <View>       
            <Text style={[styles.text_footer,{marginTop:10}]}>Register As</Text>
            <View style={styles.action}>
            <RadioButton.Group  onValueChange={(val) => {setValue2(val);handleOnChangeText(val,'role');}} value={value2}>
            <View style={{flexDirection:'row'}}>
            <View style={{flexDirection:'row'}}>
                <Text style={{paddingTop:7}}>Patient</Text>
                <RadioButton value="Patient" />
            </View>
            <View style={{paddingHorizontal:20,flexDirection:'row'}}>
                <Text style={{paddingTop:7}}>Doctor</Text>
                <RadioButton value="Doctor" />
            </View>

            </View>
            </RadioButton.Group>
            </View>
            </View>       


            <View style={styles.button}>
                <TouchableOpacity onPress={submitForm} style={styles.signIn} >
                <LinearGradient
                    colors={['#08d4c4','#01ab9d']}
                    style={styles.signIn}  
                >
                    <Text style={[styles.textSign,{color:'#fff'}]}>Confirm and Register</Text>
                </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.goBack()}
                style={[styles.signIn,{
                    borderColor:'#009387',
                    borderWidth:1,
                    marginTop:15
                }]}>
                    <Text style={[styles.textSign,{color:'#009387'}]}>Sign In</Text>
                </TouchableOpacity>
        </View>
        </ScrollView> 
    </Animatable.View>
    
    </KeyboardAvoidingView>
    {loginPending?<AppLoader/>:null}
    </>
  );
};


export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 10
    },
    footer: {
        flex: 12,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
  });
