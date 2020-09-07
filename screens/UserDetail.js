import React from "react";
import { useQuery } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import { USER_FRAGMENT } from "../fragments";
import Loader from "../components/Loader";
import { ScrollView }from "react-native";
import UserProfile from "../components/UserProfile";

const GET_USER = gql`
  query seeUser($username: String!) {
      seeUser(username: $username) {
          ...UserParts
      }
  }
  ${USER_FRAGMENT}
`;

const ME = gql`
  {
     me {
        ...UserParts
     }
  }
 ${USER_FRAGMENT}
`

export default ({route}) => {
    const { loading, data } = useQuery(GET_USER, {
        variables: { username: route.params?.username }
    });
    const { loading:meLoading, data:data2 } = useQuery(ME);
    return (
        <ScrollView>
            { loading || meLoading ? (
                <Loader />
            ) : (
              data && data2 && data.seeUser && data2.me&& <UserProfile {...data.seeUser} myName={data2.me.username} />
            )}
        </ScrollView>
    );
};