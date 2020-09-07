import React, { useState, useEffect } from 'react';
import { View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from"expo";
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { AsyncStorage } from "react-native"
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from 'apollo-cache-persist-dev';
import ApolloClient from "apollo-boost";
import { ThemeProvider } from "styled-components";
import { ApolloProvider } from "react-apollo-hooks";
import apolloClientOptions from "./apollo";
import styles from "./styles";
import NavController from "./components/NavController";
import { AuthProvider } from "./AuthContext";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";



export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notificationStatus, setStatus] = useState(false);
  
  const preLoad = async() => {
    //알림 설정 permission
    const ask = async () => {
      const { status } = await Permissions.askAsync(permissions.NOTIFICATIONS);
      setStatus(status);
      let token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      Notifications.setBadgeNumberAsync(0);
    }
    try {
      await Font.loadAsync({
         ...Ionicons.Font
    });
    await Asset.loadAsync([require("./assets/logo.png")]);
    const cache = new InMemoryCache();
    await persistCache({
      cache,
      storage: AsyncStorage
    });
    const client = new ApolloClient({
      cache,
      request: async operation => {
        const token = await AsyncStorage.getItem("jwt");
        return operation.setContext({
          headers: { authorization: token ? `Bearer ${token}` : "" }
        });
      },
      ...apolloClientOptions
    });
    const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
    if (isLoggedIn === null || isLoggedIn === "false") {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
    setLoaded(true);
    setClient(client);
   } catch(e){
     console.log(e);
   }
  };
  useEffect(() => {
    preLoad();
  },[]);
  
  return loaded && client && isLoggedIn !== null ? (
   <ApolloProvider client={client}> 
    <ThemeProvider theme={styles}>
     <AuthProvider isLoggedIn={isLoggedIn}>
       <NavController />
     </AuthProvider>
    </ThemeProvider>
   </ApolloProvider>
  ) : (
    <AppLoading />
  );
}