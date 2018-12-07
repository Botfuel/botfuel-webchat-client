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

import { ApolloClient } from 'apollo-boost';
import { split, from } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { createHttpLink } from 'apollo-link-http';
import { withClientState } from 'apollo-link-state';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import clientState from './utils/client-state-configuration';

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

function createApolloClient(websocketsSupported, serverUrl = 'https://webchat.botfuel.io') {
  const SERVER_ENDPOINT = `${serverUrl}/graphql`;
  const SERVER_ENDPOINT_WEBSOCKET = `${serverUrl.replace('http', 'ws')}/graphql`;

  const httpLink = createHttpLink({
    uri: SERVER_ENDPOINT,
  });

  const cache = new InMemoryCache({
    fragmentMatcher,
  });

  // Set up Local State
  const stateLink = withClientState({
    cache,
    ...clientState,
  });

  if (websocketsSupported) {
    // Setup subscription client
    const subscriptionClient = new SubscriptionClient(SERVER_ENDPOINT_WEBSOCKET, {
      reconnect: true,
    });
    subscriptionClient.maxConnectTimeGenerator.duration = () =>
      subscriptionClient.maxConnectTimeGenerator.max;

    // Setup WS link
    const wsLink = new WebSocketLink(subscriptionClient);

    // Setup split link between WS link and HTTP link
    const splitLink = split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      httpLink,
    );

    // Create apollo client from previous setup
    return new ApolloClient({
      cache,
      link: from([stateLink, splitLink]),
    });
  }

  // Fallback to HTTP only network interface if web sockets are not supported
  return new ApolloClient({
    cache,
    link: from([stateLink, httpLink]),
  });
}

export default createApolloClient;
