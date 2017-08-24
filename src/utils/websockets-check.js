/* eslint-disable no-console */

export default function websocketsCheck(setWebsocket) {
  if (window.WebSocket) {
    const websocket = new WebSocket('wss://echo.websocket.org/');

    websocket.onopen = () => {
      console.log('Websockets supported');
      setWebsocket(true);
    };

    websocket.onerror = () => {
      console.log('Websockets not supported');
      setWebsocket(false);
    };
  } else {
    setWebsocket(false);
  }
}
