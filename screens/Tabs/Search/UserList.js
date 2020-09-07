import React from "react";
import styled from "styled-components/native";
import constants from "../../../constants";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Text = styled.Text`
    includeFontPadding: false;
    textAlignVertical: center;
    text-align: center;
    margin-top : 20px;
    margin-bottom : 10px;
    width: ${constants.width / 1.7};
    padding: 15px;
    border: 0.5px solid #000000;
    border-radius: 4px;
    font-weight: 600;
`;

export default ({id, username, avatar, fullName}) => {
    const Navigation = useNavigation();
    const seeProfile = async(username) => {
         Navigation.navigate("UserDetail", {username});
      };
return (             
 <TouchableOpacity 
   onPress={() => seeProfile(username)}
 > 
     <Text>{username}</Text>
 </TouchableOpacity>
)
};