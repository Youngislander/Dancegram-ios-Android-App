import { ApolloClient, HttpLink, split } from "@apollo/client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from '@apollo/client/link/ws';
import { AsyncStorage } from "react-native";

const httpLink = new HttpLink({
  uri: "http://172.30.1.13:4000"
});

const wsLink = new WebSocketLink({
  uri: "wss://172.30.1.13:4000/",
  options: {
    reconnect: true,
    connectionParams: async () => {
       const token = await AsyncStorage.getItem("jwt")
       return {
         headers: {
               Authorization : token ? `Bearer ${token}` : null
            }  
          }
      }
  }
})


const client = new ApolloClient({
  request: async operation => {
    const token = await AsyncStorage.getItem("jwt");
    return operation.setContext({
      headers: { authorization: token ? `Bearer ${token}` : "" }
    });
  },
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    )
  ]),
  cache: new InMemoryCache()
});

export default client;


