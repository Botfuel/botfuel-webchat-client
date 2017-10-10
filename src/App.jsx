import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';
import { merge } from 'lodash';
import uuidv4 from 'uuid/v4';
import defaultTheme from 'theme/base';
import Root from 'components/WebChat/Root';

/* eslint-disable */
injectGlobal`
@font-face {
  font-family: 'font-awesome';
  src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff')
  format('woff');
  font-weight: normal;
  font-style: normal;
}
`;
/* eslint-enable */

class BotfuelWebChat {
  static init(param) {
    if (!localStorage.getItem('BOTFUEL_WEBCHAT_USER_ID')) {
      localStorage.setItem('BOTFUEL_WEBCHAT_USER_ID', uuidv4());
    }

    const overWriteTheme = {
      buttons: {
        close: !!param.embeddedContainerId,
      },
      fixed: !!param.embeddedContainerId,
    };
    overWriteTheme.buttons.close = !param.embeddedContainerId;
    // overWriteTheme.buttons.fullScreen = !param.embeddedContainerId;
    overWriteTheme.fixed = !param.embeddedContainerId;

    if (overWriteTheme.fixed) {
      document.body.innerHTML += '<div id="botfuel"></div>';
    }

    if (param.applicationId) {
      /* eslint-disable no-console */
      console.warn(
        'Using applicationId in the Botfuel Webchat init script is deprecated. Please use appToken instead.',
      );
      /* eslint-enable no-console */
    }

    ReactDOM.render(
      <Root
        botId={param.appToken || param.applicationId}
        startButtonSize={param.startButtonSize || 90}
        width={(param.size && param.size.width) || 400}
        height={(param.size && param.size.height) || 500}
        theme={merge(defaultTheme, param.theme, overWriteTheme)}
        initialState={{
          chatStarted: !!param.embeddedContainerId || param.startOpen || false,
          fullScreen: (!param.embeddedContainerId && param.startFullScreen) || false,
        }}
        customLabels={param.labels}
        serverUrl={param.serverUrl}
        extraAllowedOrigins={param.extraAllowedOrigins}
        disableFullScreenButton={!!param.embeddedContainerId}
        menuActions={param.menuActions || []}
      />,
      document.getElementById(param.embeddedContainerId || 'botfuel'),
    );
  }
}

self.BotfuelWebChat = BotfuelWebChat;
