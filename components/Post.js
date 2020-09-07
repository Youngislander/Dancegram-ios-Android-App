import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, Platform, TextInput, KeyboardAvoidingView, Modal, Alert} from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import Swiper from "react-native-swiper";
import { gql } from "apollo-boost";
import constants from "../constants";
import styles from "../styles";
import { useMutation } from "react-apollo-hooks";
import { ScrollView } from "react-native-gesture-handler";
import Loader from "../components/Loader";
import NavIcon from "../components/NavIcon";

export const TOGGLE_LIKE = gql`
  mutation toggleLike($postId: String!){
      toggleLike(postId: $postId)
  }
`;

const ADD_COMMENT = gql`
  mutation addComment($text: String!, $postId: String!){
      addComment(text: $text, postId: $postId){
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
  }
`;

const DELETE_POST = gql`
  mutation editPost(
    $id: String!, 
    $caption: String, 
    $location: String, 
    $action: ACTIONS!
  ){
     editPost(
       id: $id, 
       caption: $caption, 
       location: $location, 
       action: $action
    )
  }
`;

const MContainer = styled.View`
    flex: 1;
    justifyContent: flex-end;
    margin-bottom: 10px;
`;

const MView = styled.View`
    backgroundColor: #F8F8F8;
    borderRadius: 20px;
    padding: 10px;
    shadowColor: #000;
    shadowOffset: {
      width: 0;
      height: 2px;
    };
    shadowOpacity: 0.25;
    shadowRadius: 3.84px;
    elevation: 5;
`;

const MTouchable = styled.TouchableOpacity`
    color: black;
    borderBottomWidth: 1px;
    borderBottomColor: #CACACA;
    margin-bottom: 5px;
    padding: 10px 30px;
`;

const BTouchable = styled.TouchableOpacity`
    margin-top: 10px;
`;

const Text= styled.Text`
    color: black;
    font-size: 15px;
    textAlign: center;
    padding: 10px;
`;

const Container = styled.View`
  margin-bottom : 40px;
`;
const Header = styled.View`
  padding: 15px;
  justify-content: space-between;
  flex-direction: row;
`;

const Profile = styled.View`
  flex-direction: row;
  align-items: center;
`;
const More = styled.View`   
  flex-direction: row;
  align-items: center;
`;

const Touchable = styled.TouchableOpacity`
  margin-bottom: 1px;
`;
const HeaderUserContainer = styled.View`
  margin-left: 10px;
`;
const Bold = styled.Text`
 font-weight: 500;
 font-size: 13px;
`;

const Location = styled.Text`
  font-size: 12px;
`;

const IconsContainer = styled.View`
  padding: 3px;
  flex-direction: row;
`;

const IconContainer = styled.View`
  margin-right: 10px;
`

const InfoContainer = styled.View`
  padding: 10px;
`;

const Caption = styled.Text`
  margin: 5px 0px;
`;

const CommentCount = styled.Text`
  opacity: 0.5;
  font-size: 13px;
`;

const CommentText = styled.Text`
  font-size: 13px;
`

const CommentList = styled.View`
  margin-top: 3px;
  flex-direction: row;
`

export default Post = ({ 
    id,
    user, 
    location, 
    files = [],
    likeCount: likeCountProp,
    caption,
    comments = [],
    isLiked: isLikedProp,
    refetch
}) => {
  //Post를 refetch 할 때 임시 comment의 중복을 막기 위한 useEffect. 
  useEffect(()=> {
    setTComment("");
  }, [refetch])

    const navigation = useNavigation();
    const editPost = async() => {
      setModalVisible(!modalVisible);
      navigation.navigate("EditPost",{id, location, files, caption, user})
    }
    const deletePost = async() =>{
      try {
        setIsDLoading(true);
       await deleteMutation({
         variables: {
            id,
            action: "DELETE"
         }
       })
      } catch(e){
         Alert.alert("Cant delete. Try later.")
      } finally {
        setIsDLoading(false);
        navigation.navigate("TabNavigation")
      }
    }
    const [deleteMutation] = useMutation(DELETE_POST)
    const [Dloading, setIsDLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLiked, setIsLiked] = useState(isLikedProp);
    const [likeCount, setLikeCount] = useState(likeCountProp);
    const [toggleLikeMutation] = useMutation(TOGGLE_LIKE, {
        variables: {
            postId: id
        }
    });
    const [clickComment, setClickComment] = useState(false);
    const [postComments, setPostComments] = useState(comments)
    const [NComment, setNComment] = useState("");
    const [TComment, setTComment] = useState("");
    const [addCommentMutation, {loading}] = useMutation(ADD_COMMENT);
    const toggleComment = () => {
      if(clickComment === true) {
        setClickComment(false);
      } else {
        setClickComment(true);
      }
    }
    const handleLike = async () => {
        if(isLiked === true) {
            setLikeCount(l => l - 1);
        } else { 
            setLikeCount(l => l + 1);
        }
        setIsLiked(p => !p);
        try {
            await toggleLikeMutation();
        } catch (e) {}   
    };

    const onChangeText = text => setNComment(text);
    const onSubmit = async () => {
      setNComment("");
      if (NComment === "") {
        return;
      }
      try {
        const {
          data: { addComment }
        } = await addCommentMutation({
          variables: {
            text: NComment,
            postId : id
          }
        });
        setTComment(addComment);
      } catch (e) {
        console.log(e);
      }
    };
    return (
      <KeyboardAvoidingView behavior="position" enabled style={{ flex: 1 }}>
       <ScrollView
         contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-end"
        }}
       > 
        <Container>
            <Header>
               <Profile>
                    <Touchable
                    onPress={() => 
                      navigation.navigate("UserDetail", { username: user.username })
                    }
                    >
                        <Image 
                          style={{ height: 40, width: 40, borderRadius: 20 }}
                          source={{ uri: user.avatar }}  
                        />
                    </Touchable>
                    <Touchable
                      onPress={() => 
                        navigation.navigate("UserDetail", { username: user.username })
                    }
                    >
                        <HeaderUserContainer>
                            <Bold>{user.username}</Bold>
                            <Location>{location}</Location>
                        </HeaderUserContainer>
                    </Touchable>
               </Profile> 
               <More>
                    <Touchable
                    onPress={() => {setModalVisible(true)}}>
                      <NavIcon name={"ios-more"} color={"#ABABAB"} size={24} />
                    </Touchable>
                    
                        <Modal
                            animationType="slide"
                            presentationStyle="overFullScreen"
                            visible={modalVisible}
                            transparent={true}
                            onRequestClose={() => {
                              Alert.alert("Modal has been closed.");
                            }}
                          >
                        <MContainer>     
                          <MView>
                              <MTouchable
                                    onPress={editPost}>
                                    <Text style={styles.textStyle}>Edit</Text>
                              </MTouchable>
                              <MTouchable onPress={Post}>
                                <Text style={styles.textStyle}>Delete</Text>
                              </MTouchable>
                              <BTouchable
                                onPress={() => {
                                  setModalVisible(!modalVisible);
                                }}
                              >
                                <Text style={styles.textStyle}>Back</Text>
                              </BTouchable>
                          </MView>
                        </MContainer>     
                      </Modal>
                    
               </More>
            </Header>
            <Swiper
               showsPagination={false}
               style={{ height: constants.height / 2.5 }} 
            >
                {files.map(file => (
                    <Image 
                      style={{ width: constants.width, height: constants.height / 2.5 }}
                      key={file.id}
                      source={{ uri: file.url }}
                    />
                ))}
            </Swiper>
            <InfoContainer>
             <IconsContainer>
                <Touchable onPress={handleLike}>
                    <IconContainer>
                        <Ionicons
                          size={24}
                          color={isLiked ? styles.redColor : styles.blackColor}
                          name={
                              Platform.OS === "ios" 
                                ? isLiked 
                                  ? "ios-heart" 
                                  : "ios-heart-empty"
                                : isLiked
                                  ?"md-heart"
                                  : "md-heart-empty"
                          }
                        />
                    </IconContainer>
                </Touchable>
                <Touchable>
                    <IconContainer>
                        <Ionicons
                          color={styles.blackColor}
                          size={24}
                          name={
                              Platform.OS === "ios" ? "ios-text" : "md-text"
                          }
                        />
                    </IconContainer>
                </Touchable>
            </IconsContainer>
            <Touchable>
                <Bold>{likeCount === 1 ? "1 like" : `${likeCount} likes`}</Bold>
            </Touchable>
            <Caption>
                <Bold>{user.username}</Bold> {caption}
            </Caption>
            <Touchable onPress={toggleComment}>
                <CommentCount>See all {comments.length} comments</CommentCount>
                        {clickComment === true ? comments.map(comment => <CommentList><Bold>{comment.user.username}</Bold><CommentText>  {comment.text}</CommentText></CommentList>) : <></>}
                        
                        {TComment!==""&&(<CommentList><Bold>{TComment.user.username}</Bold><CommentText>  {TComment.text}</CommentText></CommentList>)} 
            </Touchable>
                <TextInput
              placeholder={"Type your comment"}
              onChangeText={onChangeText}
              style={{
                marginVertical: 0,
                height: 30,
                backgroundColor: "#F2F2F2",
                width: "80%",
                borderRadius: 10,
                padding: 0
              }}
              onSubmitEditing={onSubmit}
              returnKeyType="send"
              value={NComment}
            />
          </InfoContainer>
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

