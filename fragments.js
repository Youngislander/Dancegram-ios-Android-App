import { gql } from "apollo-boost";

export const POST_FRAGMENT = gql`
  fragment PostParts on Post {
      id
      location
      caption 
      user {
        id
        avatar
        username
      }
      files {
          id
          url
      }
      likeCount
      isLiked
      comments {
          id
          text
          user {
              id
              username
          }
      }
      createdAt
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserParts on User {
    id
    avatar
    username
    fullName
    isFollowing
    isSelf
    bio
    followingCount
    followersCount
    postsCount
    posts {
      ...PostParts
    }
  }
  ${POST_FRAGMENT}
`;

export const ROOM_FRAGMENT = gql`
   fragment RoomParts on Room {
    id
    participants {
      id
      username
    }
    messages {
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
    }
    createdAt
    }
`
