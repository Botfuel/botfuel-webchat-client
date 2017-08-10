import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import { ApolloClient, createNetworkInterface, IntrospectionFragmentMatcher } from 'react-apollo';

const SERVER_ENDPOINT = process.env.SERVER_ENDPOINT;
const SERVER_ENDPOINT_WEBSOCKET = process.env.SERVER_ENDPOINT_WEBSOCKET;

const wsClient = new SubscriptionClient(SERVER_ENDPOINT_WEBSOCKET, {
  reconnect: true,
});

const networkInterface = createNetworkInterface({
  uri: SERVER_ENDPOINT,
});

// Fragment matcher so we can use inline fragments on type Value in GraphQL queries
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: 'UNION',
          name: 'Value',
          possibleTypes: [{ name: 'Text' }, { name: 'Table' }, { name: 'Choices' }],
        },
      ],
    },
  },
});

function createApolloClient() {
  if (window.WebSocket) {
    const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(networkInterface, wsClient);

    return new ApolloClient({
      networkInterface: networkInterfaceWithSubscriptions,
      fragmentMatcher,
    });
  }

  // Fallback to HTTP only network interface if web sockets are not supported
  return new ApolloClient({
    networkInterface,
    fragmentMatcher,
  });
}

export default createApolloClient;
