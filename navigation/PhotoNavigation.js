import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SelectPhoto from "../screens/Photo/SelectPhoto";
import TakePhoto from "../screens/Photo/TakePhoto";
import UploadPhoto from "../screens/Photo/UploadPhoto";
import { stackStyles } from "./config";
import styles from "../styles";


const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const PhotoTabs = () => {
  return (
    <Tab.Navigator 
         tabBarPosition="bottom"
         tabBarOptions={
           {
             indicatorStyle: {
               backgroundColor: styles.blackColor,
               marginBottom: 20
             }
           },
           {
             labelStyle: {
               color: styles.blackColor,
               fontWeight: "600"
             }
           },
           {
             style: {
               paddingBottom: 20,
               ...stackStyles
             }
           }
         }
    >
      <Tab.Screen 
        name="TakePhoto" 
        component={TakePhoto} 
        options={
          {tabBarLabel: "Take"}
        }
        />
      <Tab.Screen 
         name="SelectPhoto" 
         component={SelectPhoto} 
         options={
           {tabBarLabel:"Select"}
         }
         />
    </Tab.Navigator>
  );
};

export default () => (
  <Stack.Navigator 
     headerMode= "none"
     screenOptions= {
      { headerStyle: {...stackStyles } },
      { headerTintColor: styles.blackColor }
    }
  >
    <Stack.Screen 
       name="PhotoTabs" 
       component={PhotoTabs}
       options={
         {title: "Choose Photo"},
         {headerBackTitle: null}       
       } 
    />
    <Stack.Screen 
       name="UploadPhoto" 
       component={UploadPhoto} 
       options={
         {title: "Upload Photo"}
       }
    />
  </Stack.Navigator>
);
