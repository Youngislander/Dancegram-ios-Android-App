import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import Signup from "../screens/Auth/Signup";
import Confirm from "../screens/Auth/Confirm";
import Login from "../screens/Auth/Login";
import AuthHome from "../screens/Auth/AuthHome";

const Stack = createStackNavigator();

const AuthNavigation=()=> {
    return (
        <NavigationContainer>
        <Stack.Navigator 
            headerMode="none"
         >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Confirm" component={Confirm} />
            <Stack.Screen name="AuthHome" component={AuthHome} />
        </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AuthNavigation;