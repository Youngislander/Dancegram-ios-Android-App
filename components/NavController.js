import React, { Suspense } from "react";
import {ActivityIndicator, View} from "react-native";
import { useIsLoggedIn } from "../AuthContext";
import AuthNavigation from "../navigation/AuthNavigation";
import MainNavigation from "../navigation/MainNavigation";



export default () => {
    const isLoggedIn = useIsLoggedIn();
        return isLoggedIn ? <Suspense fallback={
            <View
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
              <ActivityIndicator color="black" />
            </View>
          }><MainNavigation /></Suspense> : <AuthNavigation />
};