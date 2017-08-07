import React from 'react';
import ReactDOM from 'react-dom';

export default class BotfuelWebChat {
  static init(param) {
    document.body.innerHTML += '<div id="botfuel"></div>';
    ReactDOM.render(
      <WebChat startButtonSize={param.startButtonSize || 90} />,
      document.getElementById('botfuel'),
    );
  }
}

self.BotfuelWeb = BotfuelWebChat;
