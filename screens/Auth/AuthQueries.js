import gql from "graphql-tag";

export const LOG_IN = gql`
  mutation requestSecret($email: String!) {
      requestSecret(email: $email)
  }
`;

export const CREATE_ACCOUNT = gql`
  mutation createAccount(
      $username: String!
      $email: String!
      $firstName: String
      $lastName: String
      $bio: String
      $loginSecret: String
  ) {
      createAccount(
          username: $username
          email: $email
          firstName: $firstName
          lastName: $lastName
          bio: $bio
          loginSecret: $loginSecret
       )
  }
`;

export const CONFIRM_SECRET = gql`
  mutation confirmSecret($secret: String!, $email: String!) {
      confirmSecret(secret: $secret, email: $email)
  }
`