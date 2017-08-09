import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import styled, { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import StartButton from './StartButton';
import WebChat from './WebChat';
// import baseTheme from './theme/base';
import laposteTheme from './theme/laposte';

export default class BotfuelWebChat {
  static init(param) {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', uuidv4());
    }

    document.body.innerHTML += '<div id="botfuel"></div>';
    ReactDOM.render(
      <Container
        startButtonSize={param.startButtonSize || 90}
        width={param.width || 400}
        height={param.height || 500}
      />,
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
`;

class Container extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chatStarted: false,
    };
    this.switchState = this.switchState.bind(this);
  }

  switchState() {
    this.setState(oldState => ({ chatStarted: !oldState.chatStarted }));
  }

  render() {
    return (
      <ThemeProvider theme={laposteTheme}>
        <StyledContainer>
          <WebChat
            width={this.props.width}
            height={this.props.height}
            isVisible={this.state.chatStarted}
            switchMode={this.switchState}
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
