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
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { SubscriptionClient } from 'subscriptions-transport-ws';

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

  if (websocketsSupported) {
    const subscriptionClient = new SubscriptionClient(SERVER_ENDPOINT_WEBSOCKET);
    subscriptionClient.maxConnectTimeGenerator.duration = () =>
      subscriptionClient.maxConnectTimeGenerator.max;
    const wsLink = new WebSocketLink(subscriptionClient);

    const splitLink = split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      httpLink,
    );

    return new ApolloClient({
      link: splitLink,
      cache,
    });
  }

  // Fallback to HTTP only network interface if web sockets are not supported
  return new ApolloClient({
    link: httpLink,
    cache,
  });
}

export default createApolloClient;
