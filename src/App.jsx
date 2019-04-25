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

import '@babel/polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { merge } from 'lodash';
import uuidv4 from 'uuid/v4';
import defaultTheme from './theme/base';
import Root from './components/WebChat/Root';
import EmbeddedContainerError from './utils/Error';
import DOMLoaded from './utils/dom-loaded';

class BotfuelWebChat {
  static init(param) {
    function initialize() {
      if (!localStorage.getItem('BOTFUEL_WEBCHAT_USER_ID')) {
        localStorage.setItem('BOTFUEL_WEBCHAT_USER_ID', uuidv4());
      }

      const updatedTheme = {
        buttons: {
          close: !!param.embeddedContainerId,
        },
        fixed: !!param.embeddedContainerId,
      };
      updatedTheme.buttons.close = !param.embeddedContainerId;
      // updatedTheme.buttons.fullScreen = !param.embeddedContainerId;
      updatedTheme.fixed = !param.embeddedContainerId;

      if (updatedTheme.fixed) {
        const botfuelContainer = document.createElement('div');
        botfuelContainer.setAttribute('id', 'botfuel');

        document.body.appendChild(botfuelContainer);
      }

      if (param.applicationId) {
        /* eslint-disable no-console */
        console.warn(
          'Using applicationId in the Botfuel Webchat init script is deprecated. Please use appToken instead.',
        );
      }

      const mergedTheme = merge(defaultTheme, param.theme, updatedTheme);

      if (typeof mergedTheme.layout.rounded === 'boolean') {
        console.log(
          'Using a boolean as theme layout rounded property is deprecated. Please use a border-radius css string value instead.',
        );
        mergedTheme.layout.rounded = mergedTheme.layout.rounded ? '20px' : '15px';
        /* eslint-enable no-console */
      }
      const container = document.getElementById(param.embeddedContainerId || 'botfuel');
      if (container === null) {
        throw new EmbeddedContainerError();
      }
      ReactDOM.render(
        <Root
          botId={param.appToken || param.applicationId}
          startButtonSize={param.startButtonSize || 90}
          width={(param.size && param.size.width) || 400}
          height={(param.size && param.size.height) || 500}
          theme={mergedTheme}
          initialState={{
            chatStarted: !!param.embeddedContainerId || param.startOpen || false,
            fullScreen: (!param.embeddedContainerId && param.startFullScreen) || false,
          }}
          customLabels={param.labels}
          serverUrl={param.serverUrl}
          extraAllowedOrigins={param.extraAllowedOrigins}
          disableFullScreenButton={!!param.embeddedContainerId}
          menuActions={param.menuActions || []}
          voiceEnabled={param.voiceEnabled || false}
          debug={param.debug || false}
          parseHTML={param.parseHTML || false}
          sanitizeDOM={param.sanitizeDOM !== false}
          hooks={param.hooks || {}}
        />,
        container,
      );
    }

    // Wait for DOM to be ready (cross browsers handling)
    // Then initialize the webchat
    DOMLoaded(window, initialize);
  }
}

// replace window.self by self if it doesn't work
window.self.BotfuelWebChat = BotfuelWebChat;
