import React, { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import PropTypes from "prop-types";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import Loader from "../../../components/Loader";
import SquarePhoto from "../../../components/SquarePhoto"; 
import styled from "styled-components";
import UserList from "./UserList";

export const SEARCH = gql`
  query search($term: String!) {
      searchPost(term: $term) {
          id
          files{
              id
              url
          }
          likeCount
          commentCount
      }
      searchUser(term: $term) {
              id
              avatar
              username
              isFollowing
              isSelf
          }
  }
`;

const FatText = styled.Text`
  font-weight: 900;
  margin-top: 5px;
  padding: 8px;
  color: #E4E4E4;
`;
const Something = styled.Text`
  text-align: center;
  margin-top: 20px;
`;
const Container = styled.View``;
const UserContainer = styled.View`
  align-items: center;
`;
const Users = styled.View`
  borderStyle: solid;
  borderTopColor: #E4E4E4;
  padding: 1px;
  borderTopWidth: 1px
`;
const PostContainer = styled.View``;
const Posts = styled.View``;
const SearchPresenter = ({ term, shouldFetch }) => {
    const [refreshing, setRefreshing] = useState(false);
    const { data, loading, refetch } = useQuery(SEARCH, {
        variables:{
            term
        },
        skip:!shouldFetch,
        fetchPolicy: "network-only"
    });
    console.log(data, loading);
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
            {term === "" ? (<Something><FatText>Search for something!</FatText></Something>) :
                loading ? (
                    <Loader />
                ) : data&& data.searchPost&& data.searchUser&& (     
                <Container>   
                <Posts>
                    {
                    data.searchPost.length === 0 ? (
                        <FatText>No posts found</FatText>
                    ) : (
                        <PostContainer>
                         {data.searchPost.map(post => <SquarePhoto key={post.id} {...post} />)}
                        </PostContainer>
                        )
                    }
                </Posts>
                <Users>
                    {
                    data.searchUser.length === 0 ? (
                        <FatText>No users found</FatText>
                    ) : (
                        <UserContainer>
                         {data.searchUser.map(user => <UserList key={user.id} {...user} />)}
                        </UserContainer>
                        )  
                   }
                </Users>
                </Container>
                )
           }
      </ScrollView>
    );
};


SearchPresenter.propTypes = {
    term: PropTypes.string.isRequired,
    shoudFetch: PropTypes.bool.isRequired
};

export default SearchPresenter;
