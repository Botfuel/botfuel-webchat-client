import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import { ApolloClient, createNetworkInterface, IntrospectionFragmentMatcher } from 'react-apollo';

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

function createApolloClient(
  websocketsSupported,
  serverUrl = 'https://botfuel-webchat-server.herokuapp.com',
) {
  const SERVER_ENDPOINT = `${serverUrl}/graphql`;
  const SERVER_ENDPOINT_WEBSOCKET = `${serverUrl.replace('http', 'ws')}/graphql`;

  const networkInterface = createNetworkInterface({
    uri: SERVER_ENDPOINT,
  });

  if (websocketsSupported) {
    const wsClient = new SubscriptionClient(SERVER_ENDPOINT_WEBSOCKET, {
      reconnect: true,
    });
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
