import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import styled, { ThemeProvider } from 'styled-components';
import { merge } from 'lodash';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import { ApolloProvider, gql, graphql } from 'react-apollo';
import StartButton from './components/StartButton';
import WebChat from './components/WebChat';
import defaultTheme from './theme/base';
import createApolloClient from './apollo-client';
import websocketsCheck from './utils/websockets-check';

const BOT_QUERY = gql`
  query bot($botId: ID!) {
    bot(id: $botId) {
      allowedOrigins
    }
  }
`;

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
      <Root
        botId={param.botId}
        startButtonSize={param.startButtonSize || 90}
        width={(param.size && param.size.width) || 400}
        height={(param.size && param.size.height) || 500}
        theme={merge(defaultTheme, param.theme, overWriteTheme)}
        initialState={{
          chatStarted: !!param.embeddedContainerId || param.startOpen || false,
          fullScreen: (!param.embeddedContainerId && param.startFullScreen) || false,
        }}
        customLabels={param.labels}
      />,
      document.getElementById(param.embeddedContainerId || 'botfuel'),
    );
  }
}

const MainContainer = styled.div`${props => props.theme.fluid && 'height:100%;'};`;

const StyledContainer = styled.div`
  ${props => props.theme.fluid && 'height:100%;'};
  text-align: left;
  position: ${props => (props.theme.fixed ? 'fixed' : 'static')};
  bottom: 20px;
  right: 20px;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
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

class Root extends React.Component {
  constructor(props) {
    super(props);

    this.state = props.initialState;
    this.switchState = this.switchState.bind(this);
    this.toggleFullScreen = this.toggleFullScreen.bind(this);
  }

  getChildContext() {
    return {
      customLabels: this.props.customLabels,
    };
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
      return null;
    }

    return (
      <ApolloProvider client={this.client}>
        <ContainerWithData
          {...this.state}
          {...this.props}
          switchState={this.switchState}
          toggleFullScreen={this.toggleFullScreen}
        />
      </ApolloProvider>
    );
  }
}

Root.propTypes = {
  initialState: PropTypes.shape({
    startOpen: PropTypes.bool,
    startFullScreen: PropTypes.bool,
  }).isRequired,
  customLabels: PropTypes.shape({}),
};

Root.defaultProps = {
  customLabels: {},
};

Root.childContextTypes = {
  customLabels: PropTypes.object,
};

const Container = ({
  theme,
  width,
  height,
  botId,
  startButtonSize,
  fullScreen,
  chatStarted,
  switchState,
  websocketsSupported,
  toggleFullScreen,
  data: { bot = {}, loading },
}) => {
  if (!bot && !loading) {
    /* eslint-disable no-console */
    console.log('Bot not found.');
    /* eslint-enable no-console */
  }

  const { allowedOrigins = [] } = bot;
  const cleanUrls = allowedOrigins.map(url => url.replace(/\/+$/, ''));

  if (!window.location.origin) {
    // Some browsers (mainly IE < 11) does not have this property, so we need to build it manually
    window.location.origin = `${window.location.protocol}//${window.location.hostname}${window
      .location.port
      ? `:${window.location.port}`
      : ''}`;
  }

  if (!cleanUrls.includes('*') && !cleanUrls.includes(window.location.origin) && !loading) {
    /* eslint-disable no-console */
    console.log(
      'Your website is not allowed to use this webchat. Please check that this website’s url is among the allowed origins of the bot on https://botfuel.io.',
    );
    /* eslint-enable no-console */
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <MainContainer>
        <StyledContainer fullScreen={fullScreen} width={width} height={height}>
          <WebChat
            botId={botId}
            fullScreen={fullScreen}
            width={width}
            height={height}
            isVisible={chatStarted}
            switchMode={switchState}
            toggleFullScreen={toggleFullScreen}
            websocketsSupported={websocketsSupported}
          />
        </StyledContainer>
        {theme.fixed && (
          <StyledContainer>
            <StartButton
              fullScreen={fullScreen}
              isVisible={!chatStarted}
              size={startButtonSize}
              switchMode={switchState}
            />
          </StyledContainer>
        )}
      </MainContainer>
    </ThemeProvider>
  );
};

Container.propTypes = {
  botId: PropTypes.string.isRequired,
  startButtonSize: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object,
    fixed: PropTypes.bool,
  }).isRequired,
  fullScreen: PropTypes.bool,
  chatStarted: PropTypes.bool,
  switchState: PropTypes.func.isRequired,
  websocketsSupported: PropTypes.bool,
  toggleFullScreen: PropTypes.func.isRequired,
  data: PropTypes.shape({
    bot: PropTypes.object,
    loading: PropTypes.bool,
  }).isRequired,
};

Container.defaultProps = {
  fullScreen: false,
  chatStarted: false,
  websocketsSupported: false,
};

const ContainerWithData = graphql(BOT_QUERY)(Container);

self.BotfuelWebChat = BotfuelWebChat;
