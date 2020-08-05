import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Messages from "../screens/Messages/Messages";
import Message from "../screens/Messages/Message";
import { stackStyles } from "./config";
import styles from "../styles";

const Stack = createStackNavigator();

export default () => (
    <Stack.Navigator
     screenOptions={
         headerStyle={
          ...stackStyles
          },
          { 
            headerBackTitleVisible: false,
            headerTintColor: styles.blackColor,
            headerStyle:{...stackStyles} 
          }
      }
    >
        <Stack.Screen name="Messages" component={Messages} />
        <Stack.Screen name="Message" component={Message} />
    </Stack.Navigator>
);