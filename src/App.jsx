import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import styled, { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
  IntrospectionFragmentMatcher,
} from 'react-apollo';
import StartButton from './StartButton';
import WebChat from './WebChat';
// import baseTheme from './theme/base';
import laposteTheme from './theme/laposte';

const GRAPHQL_ENDPOINT = 'ws://localhost:7002/graphql';

const wsClient = new SubscriptionClient(GRAPHQL_ENDPOINT, {
  reconnect: true,
});

// Create a normal network interface:
const networkInterface = createNetworkInterface({
  uri: 'http://localhost:7001/graphql',
});
// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(networkInterface, wsClient);
// Finally, create your ApolloClient instance with the modified network interface

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: 'UNION',
          name: 'Value',
          possibleTypes: [{ name: 'Text' }, { name: 'Table' }, { name: 'Choices' }],
        }, // this is just an example, put your own INTERFACE and UNION types here!
      ],
    },
  },
});

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  fragmentMatcher,
});
export default class BotfuelWebChat {
  static init(param) {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', uuidv4());
    }

    document.body.innerHTML += '<div id="botfuel"></div>';
    ReactDOM.render(
      <ApolloProvider client={client}>
        <Container
          startButtonSize={param.startButtonSize || 90}
          width={param.width || 400}
          height={param.height || 500}
        />
      </ApolloProvider>,
      document.getElementById('botfuel'),
    );
  }
}

const StyledContainer = styled.div`
  position: fixed;
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

    this.state = {
      chatStarted: false,
      fullScreen: false,
    };
    this.switchState = this.switchState.bind(this);
    this.toggleFullScreen = this.toggleFullScreen.bind(this);
  }

  switchState() {
    this.setState(oldState => ({ chatStarted: !oldState.chatStarted }));
  }

  toggleFullScreen() {
    this.setState(oldState => ({ fullScreen: !oldState.fullScreen }));
  }

  render() {
    return (
      <ThemeProvider theme={laposteTheme}>
        <StyledContainer
          fullScreen={this.state.fullScreen}
          width={this.props.width}
          height={this.props.height}
        >
          <WebChat
            fullScreen={this.state.fullScreen}
            width={this.props.width}
            height={this.props.height}
            isVisible={this.state.chatStarted}
            switchMode={this.switchState}
            toggleFullScreen={this.toggleFullScreen}
          />
          <StartButton
            isVisible={!this.state.chatStarted}
            size={this.props.startButtonSize}
            switchMode={this.switchState}
          />
        </StyledContainer>
      </ThemeProvider>
    );
  }
}

Container.propTypes = {
  startButtonSize: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

self.BotfuelWebChat = BotfuelWebChat;
