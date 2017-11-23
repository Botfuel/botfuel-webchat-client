/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
  serverUrl = 'https://webchat.botfuel.io',
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
