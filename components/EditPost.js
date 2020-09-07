import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Image, Platform, TextInput, KeyboardAvoidingView, Modal, Alert} from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import Swiper from "react-native-swiper";
import { gql } from "apollo-boost";
import constants from "../constants";
import styles from "../styles";
import { useMutation } from "react-apollo-hooks";
import { ScrollView } from "react-native-gesture-handler";
import useInput from "../hooks/useInput";
import { FEED_QUERY } from "../screens/Tabs/Home";

const EDIT_POST = gql`
  mutation editPost($id: String!, $caption: String, $location: String, $action: ACTIONS!){
      editPost(id: $id, caption: $caption, location: $location, action: $action){
        id
        user {
            id
            username
            avatar
        }
        location 
        files {
            id
            url
            createdAt
        }
        likeCount
        caption
        comments {
            id
            text
            user {
                id
                username
            }
            post {
                id
            }
            createdAt
        }
        isLiked
      }
  }
`


const EContainer = styled.View`
    align-items: center;
`;

const SwiperContainer = styled.View`

`;

const Container = styled.View`
align-items: center;
justify-content: center;
height: ${constants.height / 1.5} 
`;

const Form = styled.View`
  margin-bottom: 70px;
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



const Text= styled.Text`
    color: black;
    font-size: 15px;
    textAlign: center;
    padding: 10px;
`;



export default ({route}) => {
    const navigation = useNavigation();
    const [loading, setIsLoading] = useState(false);
    const id = route.params?.id;
    const files = route.params?.files;
    const user = route.params?.user;
    const captionInput = useInput(route.params?.caption);
    const locationInput = useInput(route.params?.location);
    const [editMutation] = useMutation(EDIT_POST, {
        refetchQueries: () => [{ query: FEED_QUERY }]
      }) 
    
    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const {
                data: { editPost }
            } = await editMutation({
                variables : { 
                    id,
                    caption: captionInput.value,
                    location: locationInput.value,
                    action: "EDIT"
                }
            })
            console.log(editPost)
           if(editPost.id) {
            navigation.goBack()
        }
        } catch(e) {
            Alert.alert("Can't edit","Try later.");
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
      <KeyboardAvoidingView behavior="position"  >
        <ScrollView
         contentContainerStyle={{
          alignItems: "center"
        }}
        > 
         <Container>
            <Swiper
               showsPagination={false}
               style={{ height: constants.height / 3.5 }} 
            >
                {files.map(file => (
                    <Image 
                      style={{ width: constants.width, height: constants.height / 2.5 }}
                      key={file.id}
                      source={{ uri: file.url }}
                    />
                ))}
            </Swiper>
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
        </ScrollView>
      </KeyboardAvoidingView>
    );
};

Post.propTypes = {
    id: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      avatar: PropTypes.string,
      username: PropTypes.string.isRequired
    }).isRequired,
    files: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
      })
    ).isRequired,
    likeCount: PropTypes.number.isRequired,
    isLiked: PropTypes.bool.isRequired,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        user: PropTypes.shape({
          id: PropTypes.string.isRequired,
          username: PropTypes.string.isRequired
        }).isRequired
      })
    ).isRequired,
    caption: PropTypes.string.isRequired,
    location: PropTypes.string,
    createdAt: PropTypes.string.isRequired
  };
