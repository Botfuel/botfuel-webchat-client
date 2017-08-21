import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import styled, { ThemeProvider } from 'styled-components';
import { merge } from 'lodash';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import { ApolloProvider } from 'react-apollo';
import StartButton from './components/StartButton';
import WebChat from './components/WebChat';
import defaultTheme from './theme/base';
import createApolloClient from './apollo-client';
import websocketsCheck from './utils/websockets-check';

class BotfuelWebChat {
  static init(param) {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', uuidv4());
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
    ReactDOM.render(
      <Container
        appId={param.appId}
        startButtonSize={param.startButtonSize || 90}
        width={(param.size && param.size.width) || 400}
        height={(param.size && param.size.height) || 500}
        theme={merge(defaultTheme, param.theme, overWriteTheme)}
        initialState={{
          chatStarted: !!param.embeddedContainerId || param.startOpen || false,
          fullScreen: (!param.embeddedContainerId && param.startFullScreen) || false,
        }}
      />,
      document.getElementById(param.embeddedContainerId || 'botfuel'),
    );
  }
}

const StyledContainer = styled.div`
  text-align: left;
  position: ${props => (props.theme.fixed ? 'fixed' : 'static')};
  bottom: 20px;
  right: 20px;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  * {
    box-sizing: border-box;
  }
  @media (max-height: ${props => props.height + 20}px),
    (max-width: ${props => props.width + 20}px),
    ${props => props.fullScreen && 'all'} {
    bottom: 0;
    right: 0;
  }
`;

class Container extends React.Component {
  constructor(props) {
    super(props);

    this.state = props.initialState;
    this.switchState = this.switchState.bind(this);
    this.toggleFullScreen = this.toggleFullScreen.bind(this);
  }

  componentWillMount() {
    const setWebsocket = (websocket) => {
      // Store whether websockets are supported
      this.client = createApolloClient(websocket);
      this.setState({
        websocketsSupported: websocket,
      });
    };

    websocketsCheck(setWebsocket);
  }

  switchState() {
    this.setState(oldState => ({ chatStarted: !oldState.chatStarted }));
  }

  toggleFullScreen() {
    this.setState(oldState => ({ fullScreen: !oldState.fullScreen }));
  }

  render() {
    // While we check for websockets support
    if (this.state.websocketsSupported === null || !this.client) {
      return <div>LOADING</div>;
    }

    return (
      <ApolloProvider client={this.client}>
        <ThemeProvider theme={this.props.theme}>
          <div>
            <StyledContainer
              fullScreen={this.state.fullScreen}
              width={this.props.width}
              height={this.props.height}
            >
              <WebChat
                appId={this.props.appId}
                fullScreen={this.state.fullScreen}
                width={this.props.width}
                height={this.props.height}
                isVisible={this.state.chatStarted}
                switchMode={this.switchState}
                toggleFullScreen={this.toggleFullScreen}
                websocketsSupported={this.state.websocketsSupported}
              />
            </StyledContainer>
            {this.props.theme.fixed &&
              <StyledContainer>
                <StartButton
                  fullScreen={this.state.fullScreen}
                  isVisible={!this.state.chatStarted}
                  size={this.props.startButtonSize}
                  switchMode={this.switchState}
                />
              </StyledContainer>}
          </div>
        </ThemeProvider>
      </ApolloProvider>
    );
  }
}

Container.propTypes = {
  appId: PropTypes.string.isRequired,
  startButtonSize: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object,
    fixed: PropTypes.bool,
  }).isRequired,
  initialState: PropTypes.shape({
    startOpen: PropTypes.bool,
    startFullScreen: PropTypes.bool,
  }).isRequired,
};

self.BotfuelWebChat = BotfuelWebChat;
