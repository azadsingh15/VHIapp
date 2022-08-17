import React,{createContext,useContext,useState} from 'react';
import { useEffect } from 'react/cjs/react.development';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

const LoginContext=createContext();

const LoginProvider=({children})=>{
    const [isLoggedIn,setIsLoggedIn]=useState(false);
    const [profile,setProfile]=useState({});
    const [loginPending,setLoginPending]=useState(false);

    const fetchUser =async() =>{
        setLoginPending(true);
        const token =await AsyncStorage.getItem('token');
        if(token!==null)
        {
            const res=await client.get('/profile',{
                headers:{
                    Authorization:`JWT ${token}` 
                }
            })
            //console.log(res.data)
            if(res.data.success)
            {
                setProfile(res.data.profile)
                setIsLoggedIn(true)
            }
            else{
                setProfile({});
                setIsLoggedIn(false);
            }
            setLoginPending(false)
        }
        else{
            setProfile({});
            setIsLoggedIn(false);
            setLoginPending(false)
        }
    }
    useEffect(()=>{
        fetchUser()
    },[])

    return (<LoginContext.Provider value={{isLoggedIn,setIsLoggedIn,profile,setProfile,loginPending,setLoginPending}}>
        {children}
    </LoginContext.Provider>);
}

export const useLogin=()=> useContext(LoginContext);
export default LoginProvider;