import React, { useState } from "react";
import {RefreshControl,TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import Loader from "../../components/Loader";
import UserList from "./UserList";
import styled from "styled-components/native"



const ScrollView = styled.ScrollView`
  marginTop : 15
 `;

 const Choose = styled.Text`
   font-weight: 800;
   font-size: 15px;
   text-align: center;
`


export const SEARCH_USER = gql`
  query serach($term: String!) {
    searchUser(term: $term) {
      id
      avatar
      username
      firstName
      lastName
      fullName
    }
   }
`
const UserLists = ({ term, shouldFetch }) => {
    const [refreshing, setRefreshing] = useState(false);
    const { data, loading, refetch } = useQuery(SEARCH_USER, {
        variables:{
            term
        },
        skip:!shouldFetch,
        fetchPolicy: "network-only"
    });
    const onRefresh = async () => {
        try{
            setRefreshing(true);
            await refetch({ variables: { term } });
        } catch (e) {
        } finally {
         setRefreshing(false);
      }
    };
    return (
        <ScrollView
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }
        >
            {loading ? (
                <Loader />
            ) : ( 
             <>             
              <Choose>
               Find a user or choose a chat room!
              </Choose> 
                 {
                  data &&
                  data.searchUser &&
                  data.searchUser.map(user => <UserList key={user.id} {...user} />)  
                 }
              </>
            )
        }
        </ScrollView>
    );
}

UserLists.propTypes = {
    term: PropTypes.string.isRequired,
    shoudFetch: PropTypes.bool.isRequired
};

export default UserLists;
