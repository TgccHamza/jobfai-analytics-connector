
import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { onError } from '@apollo/client/link/error';
import { toast } from "sonner";

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      toast.error(`GraphQL Error: ${message}`);
    });
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    toast.error("Network error. Please check your connection.");
  }
});

// HTTP connection for queries and mutations
const httpLink = new HttpLink({
  uri: 'http://localhost:8080/query', // Update with actual API URL
  credentials: 'include'
});

// WebSocket connection for subscriptions
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:8080/query', // Update with actual API URL
  connectionParams: () => {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
}));

// Split links based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

// Create the Apollo Client
export const apolloClient = new ApolloClient({
  link: errorLink.concat(splitLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getGames: {
            merge(existing, incoming) {
              return incoming;
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
