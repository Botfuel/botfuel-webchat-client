import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import StartButton from './StartButton';
import WebChat from './WebChat';

export default class BotfuelWebChat {
  static init(param) {
    document.body.innerHTML += '<div id="botfuel"></div>';
    ReactDOM.render(
      <Container startButtonSize={param.startButtonSize || 90} />,
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
  }
  switchState() {
    this.setState({ chatStarted: !this.state.chatStarted });
  }
  render() {
    return (
      <StyledContainer>
        <WebChat
          appEndPoint={this.props.appEndPoint}
          isVisible={this.state.chatStarted}
          switchMode={() => this.switchState()}
        />
        <StartButton
          isVisible={!this.state.chatStarted}
          size={this.props.startButtonSize}
          switchMode={() => this.switchState()}
        />
      </StyledContainer>
    );
  }
}

self.BotfuelWebChat = BotfuelWebChat;
