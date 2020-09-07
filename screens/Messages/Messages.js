import React,{ useState } from "react";
import { ScrollView, RefreshControl, Image } from "react-native";
import useInput from "../../hooks/useInput";
import { useNavigation } from "@react-navigation/native";
import { gql } from "apollo-boost";
import Loader from "../../components/Loader";
import styled from "styled-components";
import { useQuery, ApolloProvider } from "react-apollo-hooks";
import { ROOM_FRAGMENT, USER_FRAGMENT } from "../../fragments";
import SearchBar from "../../components/SearchBar";
import UserLists from "./UserLists";
import constants from "../../constants";
import { ME } from "../Tabs/Profile"
import client from "./apollo";
 
const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  backgroundColor: #e3d360;
`;

const ChatContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  margin-bottom: 25;
`;

const ChatArray = styled.View`
    padding: 20px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const Touchable = styled.TouchableOpacity`
    padding: 10px;
    border-radius: 4px;
    backgroundColor: #ECECEC;
    width: ${constants.width / 1.5};
`;

const Start = styled.Text`
    color: black;
    text-align: center;
    font-weight: 900;
    font-size: 30;
`;

const With = styled.Text`
    color: black;
    text-align: left;
    font-weight: 900;
    font-size: 15;
`;

const Lst = styled.Text`
    color: #93ACE6;
    text-align: left;
    font-size: 12;
    font-weight: 900;
    margin-top : 10px;
`

const LastM = styled.Text`
    color: #C3C4C8;
    text-align: left;
    font-size: 12;
    font-weight: 900;
    margin-top : 2px;
`

const SearchContainer = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;
    margin-bottom: 15px;
`;


const Avatar = styled.View``;

const ChatItems = styled.View`
   
`;



const SEE_ROOMS = gql`
  query myRooms {
    myRooms {
      ...RoomParts
    }
  }
    ${ROOM_FRAGMENT}
  `;


export default () => {
  const [term, setTerm] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(SEE_ROOMS);
  const { data: {me} } = useQuery(ME, {suspend: true});
  const Navigation = useNavigation();

  console.log(me.username);
  const onChange = (text) => {
    setTerm(text);
    setShouldFetch(false);
  }
  const onSubmit = () => {
    console.log("submit");
    setShouldFetch(true);
  };
  const navigation = useNavigation();
  const refresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch(e){
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };
   return (
   <ApolloProvider client={client}>
    <ScrollView
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
   >
     {loading ? (
        <Loader />
      ) : (
         <>
              <View style={{ padding: 15 }}> 
              <Start>Start Chat!</Start>
              <SearchBar
                value={term}
                onChange={onChange}
                onSubmit={onSubmit}  
              />
              </View>
              <SearchContainer>
                <UserLists term={term} shouldFetch={shouldFetch} />
              </SearchContainer>

              {data&&
              data.myRooms&&
              data.myRooms.map(room => (
              <ChatContainer>
              <Touchable onPress={()=>Navigation.navigate("Message", {roomId: room.id, id: room.participants[1].id === me.id ? room.participants[0].id : room.participants[1].id})}>
               <ChatArray>  
                <Avatar>
                  <Image
                  style={{ height: 60, width: 60, borderRadius: 40 }}
                  source={{ uri: room.participants[1].username === me.username ? room.participants[0].avatar : room.participants[1].avatar }}
                   />
                </Avatar> 
                <ChatItems> 
              <With>With "{room.participants[1].username === me.username ? room.participants[0].username : room.participants[1].username}"</With>
                 <Lst>Last message:</Lst>
                 <LastM>{room.messages[room.messages.length-1].text}</LastM>
                </ChatItems>
               </ChatArray>
              </Touchable>
              </ChatContainer>
                  )
                ) 
              }
         </>
         )
    }
    </ScrollView>
   </ApolloProvider>
   ) 
  }
    