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

const client = createApolloClient();

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
          width={param.size.width || 400}
          height={param.size.height || 500}
          theme={merge(defaultTheme, param.theme)}
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
      <ThemeProvider theme={this.props.theme}>
        <div>
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
          </StyledContainer>
          <StyledContainer>
            <StartButton
              fullScreen={this.state.fullScreen}
              isVisible={!this.state.chatStarted}
              size={this.props.startButtonSize}
              switchMode={this.switchState}
            />
          </StyledContainer>
        </div>
      </ThemeProvider>
    );
  }
}

Container.propTypes = {
  startButtonSize: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object,
  }).isRequired,
};

self.BotfuelWebChat = BotfuelWebChat;
