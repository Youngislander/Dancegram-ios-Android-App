import React, { useState } from "react";
import axios from "axios";
import { Image, ActivityIndicator, Alert } from "react-native";
import styled from "styled-components";
import useInput from "../../hooks/useInput";
import styles from "../../styles";
import constants from "../../constants";
import AuthButton from "../../components/AuthButton";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";
import { FEED_QUERY } from "../Tabs/Home";

const UPLOAD = gql`
  mutation upload($caption: String!, $files: [String!]!, $location: String) {
    upload(caption: $caption, files: $files, location: $location) {
      id
      caption
      location
    }
  }
`;

const View = styled.View`
  flex: 1;
`;

const Container = styled.View`
  margin-top: 50px;
  padding: 20px;
  flex-direction: row;
`;

const Form = styled.View`
 justify-content: flex-start;
`;

const STextInput = styled.TextInput`
  margin-bottom: 10px;
  border: 0px solid ${styles.lightGreyColor};
  border-bottom-width: 1px;
  padding-bottom: 10px;
  width: ${constants.width - 180};
`;

const Button = styled.TouchableOpacity`
  background-color: ${props => props.theme.blueColor};
  padding: 10px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

const Text = styled.Text`
  color: white;
  font-weight: 600;
`;

export default ({navigation, route}) => {
   const [loading, setIsLoading] = useState(false);
   const photo = route.params.photo;
   const captionInput = useInput("");
   const locationInput = useInput("");
   const [uploadMutation] = useMutation(UPLOAD, {
     refetchQueries: () => [{ query: FEED_QUERY }]
   })
   
   const handleSubmit = async () => {
     if (captionInput.value === "" || locationInput.value === ""){
       Alert.alert("All fields are required.");
     }
   const formData = new FormData();
   photo.map( photo => {
      const name = photo.filename;
      const [, type] = name.split(".");
      formData.append("files", {
        name,
        type: type.toLowerCase(),
        uri: photo.uri
      });
    })
   try {
     setIsLoading(true);
     const 
       files
   = await axios.post("http://172.30.1.13:4000/api/upload", formData, {
     headers: {
       "content-type" : "multipart/form-data"
     }
   });
   console.log(files.data.files)
   const locationArray = files.data.files.map(location => location.location)
   console.log(locationArray);
   const {
     data: { upload }
   } = await uploadMutation({
     variables: {
       files: locationArray,
       caption: captionInput.value,
       location: locationInput.value
     }
   });
   if (upload.id) {
     navigation.navigate("TabNavigation");
   }
  } catch(e) {
    Alert.alert("Cant upload", "Try later");
    console.log(e);
  } finally {
    setIsLoading(false);
  }
}
   return (
     <View>
       <Container>
         <Image 
           source={{ uri: photo[photo.length-1].uri }}
           style={{ height: 80, width: 80, marginRight: 30 }}
         />
         <Form>
           <STextInput
            onChangeText={captionInput.onChange}
            value={captionInput.value}
            placeholder="Caption"
            multiline={true}
            placeholderTextColor={styles.darkGreyColor}
          />
          <STextInput 
            onChangeText={locationInput.onChange}
            value={locationInput.value}
            placeholder="Location"
            multiline={true}
            placeholderTextColor={styles.darkGreyColor}
          />
          <Button onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text>Upload</Text>
            )
          }
          </Button>
         </Form>
       </Container>
     </View>
   );
};