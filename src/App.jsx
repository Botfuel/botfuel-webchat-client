import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import StartButton from './StartButton';
import WebChat from './WebChat';

export default class BotfuelWebChat {
  static init(param) {
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
    );
  }
}

Container.propTypes = {
  startButtonSize: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

self.BotfuelWebChat = BotfuelWebChat;
