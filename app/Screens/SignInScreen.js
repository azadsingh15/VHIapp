import React from "react";
import {
  StyleSheet,
  Text,
  Alert,
  View,
  Button,
  TouchableOpacity,
  Dimensions,
  Platform,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import * as Animatable from "react-native-animatable";
import { StackActions } from "@react-navigation/native";
import client from "../api/client";
import { useLogin } from "../context/LoginProvider";
import AppLoader from "./AppLoader";
import { signIn } from "../api/user";

const isValidObjField = (obj) => {
  return Object.values(obj).every((val) => val);
};

const isValidEmail = (val) => {
  const regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  return regx.test(val);
};

const SignInScreen = ({ navigation }) => {
  const { setIsLoggedIn, setProfile } = useLogin();
  const { loginPending, setLoginPending } = useLogin();
  const [data, setData] = React.useState({
    email: "",
    password: "",
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });
  const { email, password } = data;
  const handleOnChangeText = (val, fieldname) => {
    setData({ ...data, [fieldname]: val });
    //console.log(val,fieldname);
  };

  const textInputChange = (val) => {
    handleOnChangeText(val, "email");
    if (val.trim().length >= 4) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };
  const handlePasswordChange = (val) => {
    handleOnChangeText(val, "password");
    if (val.trim().length >= 8) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };
  const handleValidUser = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };
  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };
  const isValidForm = () => {
    if (!isValidObjField(data))
      Alert.alert("Required all fields!!", "Please fill all the fields.", [
        { text: "Okay" },
      ]);
    else {
      if (!email.trim() || email.length < 4)
        Alert.alert("Required valid email!!", "Please fill valid email.", [
          { text: "Okay" },
        ]);
      if (!isValidEmail(email))
        Alert.alert("Required a valid email!!", "Please fill valid email.", [
          { text: "Okay" },
        ]);
      if (!password.trim() || password.length < 8)
        Alert.alert(
          "Required valid password!!",
          "Please fill a password that is more than 8 characters.",
          [{ text: "Okay" }]
        );
    }
    return true;
  };
  const submitForm = async () => {
    setLoginPending(true);
    if (isValidForm()) {
      try {
        const res = await signIn(data.email, data.password);
        if (res.data.success) {
          setData({ email: "", password: "" });
          setProfile(res.data.user);
          setIsLoggedIn(true);
          navigation.dispatch(StackActions.replace("MainNavigator"));
        } else {
          Alert.alert("Email/Password does not match");
        }
        console.log(res.data);
      } catch (error) {
        console.log(error.message);
      }
    }
    setLoginPending(false);
  };

  return (
    <>
      <KeyboardAvoidingView style={styles.container}>
        <StatusBar backgroundColor="#009387" barStyle="light-content" />

        <View style={styles.header}>
          <Text style={styles.text_header}>Welcome!</Text>
        </View>

        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
          <ScrollView>
            <Text style={styles.text_footer}>Email</Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" color="#05375a" size={20} />
              <TextInput
                value={email}
                placeholder="Your Email"
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => textInputChange(val)}
                onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
              />
              {data.check_textInputChange ? (
                <Animatable.View animation="bounceIn">
                  <Feather name="check-circle" color="green" size={20} />
                </Animatable.View>
              ) : null}
            </View>
            {data.isValidUser ? null : (
              <Animatable.View animation="fadeInLeft" duartion={500}>
                <Text style={styles.errorMsg}>
                  Username must be 4 characters long.
                </Text>
              </Animatable.View>
            )}
            <Text style={[styles.text_footer, { marginTop: 35 }]}>
              Password
            </Text>
            <View style={styles.action}>
              <Feather name="lock" color="#05375a" size={20} />
              <TextInput
                value={password}
                placeholder="Your Password"
                secureTextEntry={data.secureTextEntry ? true : false}
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => handlePasswordChange(val)}
              />
              <TouchableOpacity onPress={updateSecureTextEntry}>
                {data.secureTextEntry ? (
                  <Feather name="eye-off" color="grey" size={20} />
                ) : (
                  <Feather name="eye" color="grey" size={20} />
                )}
              </TouchableOpacity>
            </View>
            {data.isValidPassword ? null : (
              <Animatable.View animation="fadeInLeft" duartion={500}>
                <Text style={styles.errorMsg}>
                  Password must be 8 characters long.
                </Text>
              </Animatable.View>
            )}
            <View style={styles.button}>
              <TouchableOpacity onPress={submitForm} style={styles.signIn}>
                <LinearGradient
                  colors={["#08d4c4", "#01ab9d"]}
                  style={styles.signIn}
                >
                  <Text style={[styles.textSign, { color: "#fff" }]}>
                    Sign In
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignUpScreen")}
                style={[
                  styles.signIn,
                  {
                    borderColor: "#009387",
                    borderWidth: 1,
                    marginTop: 15,
                  },
                ]}
              >
                <Text style={[styles.textSign, { color: "#009387" }]}>
                  New User? Register Here!
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animatable.View>
      </KeyboardAvoidingView>
      {loginPending ? <AppLoader /> : null}
    </>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009387",
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
    color: "#05375a",
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
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
