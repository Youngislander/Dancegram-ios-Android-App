import React from "react";
import styled from "styled-components/native"
import { TouchableOpacity } from "react-native-gesture-handler";
import constants from "../../constants";

const View = styled.View`
  height: 100%;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const AuthButton = styled.TouchableOpacity``;

const Image = styled.Image`
  width: ${constants.width / 2.5}
`;

const Touchable = styled.TouchableOpacity``;

const LoginLink = styled.View``;
const LoginLinkText = styled.Text`
  color: ${props => props.theme.blueColor};
  margin-top: 20px;
  font-weight: 600;
`;

const Text = styled.Text``;

export default ({ navigation }) => (
    <View>
       <Image resizeMode={"contain"} source={require("../../assets/logo.png")} />
       <AuthButton 
         text={"Create New Account"}
         onPress={() => navigation.navigate("Signup")}
       >
         <Text>Sign up</Text>
        </AuthButton>
       <Touchable onPress={() => navigation.navigate("Login")}>
        <LoginLink>
            <LoginLinkText>Login</LoginLinkText>
        </LoginLink>
       </Touchable>
    </View>
);