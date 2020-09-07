import React from "react";
import styled from "styled-components/native";
import { gql } from "apollo-boost";
import { TouchableOpacity } from "react-native";
import constants from "../../constants";
import {ME} from "../Tabs/Profile"
import { useQuery } from "react-apollo-hooks";
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
    const seeMessage = async(id) => {
         Navigation.navigate("Message", {id});
      };
return (             
 <TouchableOpacity 
   onPress={ () => seeMessage(id)}
 > 
     <Text>{username}</Text>
 </TouchableOpacity>
)
};