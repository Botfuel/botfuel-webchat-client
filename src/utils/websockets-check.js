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

/* eslint-disable no-console */
export default function websocketsCheck(setWebsocket) {
  if (window.WebSocket) {
    const ws = new WebSocket('wss://webchat.botfuel.io/graphql');

    ws.onopen = () => {
      console.log('Websockets supported');
      ws.close();
      setWebsocket(true);
    };

    ws.onerror = () => {
      console.log('Websockets not supported');
      setWebsocket(false);
    };
  } else {
    setWebsocket(false);
  }
}
