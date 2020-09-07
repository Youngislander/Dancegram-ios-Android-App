import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Text,
  KeyboardAvoidingView
} from "react-native";
import Loader from "../../components/Loader";
import { gql } from "apollo-boost";
import { useMutation, useQuery, useSubscription, ApolloProvider } from "react-apollo-hooks";
import { ROOM_FRAGMENT } from "../../fragments";
import client from "./apollo";


const SEND_MESSAGE = gql`
  mutation sendMessage($roomId: String, $message: String!, $toId: String) {
    sendMessage(roomId: $roomId, message: $message, toId:$toId) {
      id
      text
      from {
        id
        username
       }
      to {
        id
        username
      }
      room {
        id
        createdAt
      }
      createdAt
    }
  }
`;

const SEE_ROOMS = gql`
 query seeRooms($toId: String) {
   seeRooms(toId: $toId) {
     ...RoomParts
   }
 }
  ${ROOM_FRAGMENT}
`;

const NEW_MESSAGE = gql`
  subscription newMessage($roomId: String) {
    newMessage (roomId: $roomId) {
       id
       text
       from {
         id
         username
        }
       to {
         id
         username
        }
       createdAt
     }
    }
`;

export default ({route}) => {
  const toId = route.params?.id
  const [Nmessage, setNMessage] = useState("");
  const [sendText, setSendText] = useState("");
  const {data: connectRoom, refetch } = useQuery(SEE_ROOMS, {
    variables: { toId }
  }, { suspend: true });
  const [roomId, setRoomId] = useState(connectRoom.seeRooms[0].id);
  const { loading, data: newMessage, error } = useSubscription(NEW_MESSAGE, {variables: {roomId} });
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);
  const [messages, setMessages] = useState(connectRoom.seeRooms[0].messages);

  const updateMessages = () =>{
    if(newMessage !== undefined) {
      newMessage.newMessage&& 
      setMessages(previous => [...previous, newMessage.newMessage]);
      console.log(newMessage)
    } 
    console.log(newMessage)
  }

  useEffect(() => {
   refetch();
   updateMessages();
  }, [newMessage]);

  const onChangeText = text => setNMessage(text);
  const onSubmit = async () => {
    setSendText(Nmessage);
    setNMessage("");
    if (Nmessage === "") {
      return;
    }
    try {
      const {
        data: { sendMessage }
      } = await sendMessageMutation({
        variables: {
          message: Nmessage,
          toId,
          roomId
        }
      });
    console.log(sendMessage.text);
    console.log(newMessage);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <ApolloProvider client={client}> 
    <KeyboardAvoidingView behavior="padding" enabled style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          paddingTop: 50,
          alignItems: "center",
          justifyContent: "flex-end"
        }}
      >
       {loading ? ( 
          <Loader />
       ) : 
           <>
          { messages&&messages.map(m => (
          <View key={m.id} style={{ marginBottom: 10 }}>
            <Text>{m.text}</Text>
          </View>
          ))
          } 
          </>
       }
      </ScrollView>
      <TextInput
          placeholder={"Type your message"}
          onChangeText={onChangeText}
          style={{
            marginVertical: 100,
            height: 50,
            backgroundColor: "#F2F2F2",
            width: "80%",
            borderRadius: 10,
            padding: 10
          }}
          onSubmitEditing={onSubmit}
          returnKeyType="send"
          value={Nmessage}
        />
    </KeyboardAvoidingView>
    </ApolloProvider>
  );
}