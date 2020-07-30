import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Tabs/Home";
import Profile from "../screens/Tabs/Profile";
import Search from "../screens/Tabs/Search";
import Notifications from "../screens/Tabs/Notifications";
import MessagesLink from "../components/MessagesLink";
import { Platform, View } from "react-native";
import NavIcon from "../components/NavIcon";
import { stackStyles } from "./config";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const stackFactory = (initialRoute, name, customConfig) => (
  <Stack.Navigator>
    <Stack.Screen
      name={name}
      component={initialRoute}
      options={{ 
        ...customConfig,
        headerStyle: { ...stackStyles }
       }}
    />
  </Stack.Navigator>
);

export default () => (
  <Tab.Navigator
    tabBarOptions={{
      showLabel: false
    }}
    tabStyle={{ 
      backgroundColor: "#FAFAFA"
     }}
  >
    <Tab.Screen 
      name="Home"
      options={
        {
          tabBarIcon: ({ focused }) => ( 
          <NavIcon
            focused={focused}  
            name={Platform.os === "ios" ? "ios-home" : "md-home"} 
          /> )
        }
      }
      >
      {() =>
        stackFactory(Home, "Home", {
          headerRight: () => <MessagesLink />,
          headerTitle: <NavIcon name="logo-instagram" size={36} />
        })
      }
    </Tab.Screen>
    <Tab.Screen 
      name="Search"
      options={
        {
          tabBarIcon: ({ focused }) => ( 
          <NavIcon
           focused={focused} 
           name={Platform.os === "ios" ? "ios-search" : "md-search"} 
          /> )
        }
       }
    >
      {() =>
        stackFactory(Search, "Search", {
          title: "Search",
        })
      }
    </Tab.Screen>
    <Tab.Screen
      name="Add"
      component={View}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault();
          navigation.navigate("PhotoNavigation");
        }
      })}
      options={
        {
          tabBarIcon: ({ focused }) => (
           <NavIcon
             focused={focused} 
             name={Platform.os === "ios" ? "ios-add" : "md-add"} 
           /> )
        }
      }
    />
    <Tab.Screen 
      name="Notifications"
      options={
        {
          tabBarIcon: ({ focused }) => (
            <NavIcon
              focused={focused} 
              name={Platform.os === "ios" 
                      ? focused
                        ? "ios-heart" 
                        : "md-heart"
                      : focused
                        ? "md-heart"
                        : "md-heart-empty"
                      } 
            /> )
        }
      }
    >
      {() =>
        stackFactory(Notifications, "Notifications", {
          title: "Notifications"
        })
      }
    </Tab.Screen>
    <Tab.Screen 
      name="Profile"
      options={
        {
          tabBarIcon: ({ focused }) => (
            <NavIcon
              focused={focused} 
              name={Platform.os === "ios" ? "ios-person" : "md-person"} 
            /> )
        }
      }
    >
      {() =>
        stackFactory(Profile, "Profile", {
          title: "Profile"
        })
      }
    </Tab.Screen>
  </Tab.Navigator>
);

