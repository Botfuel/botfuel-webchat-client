import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Bottom from './Bottom';
import Top from './Top';
import MessageListContainer from '../components/message/MessageListContainer';

const Container = styled.div`
  transition: opacity 0.5s ease-in-out;
  display: ${props => (props.isVisible ? 'block' : 'none')};
  color: #000;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  box-shadow: 0 0 24px rgba(0, 0, 0, .15);
  border: 1px solid #e3e3e3;
  border-radius: 10px;
  overflow: hidden;
`;

export default class WebChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };

    this.onSendMessage = this.onSendMessage.bind(this);
  }

  async onSendMessage(e) {
    if (e && e.nativeEvent.keyCode === 13) {
      const text = e.target.value;

      if (text) {
        e.target.value = '';
        this.setState(oldState => ({
          messages: [...oldState.messages, { type: 'text', value: text, sender: 'me' }],
        }));

        // MOCKING
        if (['text', 'table', 'choices'].includes(text)) {
          const response = await fetch(`http://localhost:7001/${text}`);
          const answer = text === 'text' ? await response.text() : await response.json();

          setTimeout(() => {
            this.setState(oldState => ({
              messages: [...oldState.messages, { type: text, value: answer, sender: 'bot' }],
            }));
          }, 1000);
        }
      }
    }
  }

  render() {
    return (
      <Container
        width={this.props.width}
        height={this.props.height}
        isVisible={this.props.isVisible}
      >
        <Top switchMode={this.props.switchMode} />
        <MessageListContainer height={this.props.height - 85} messages={this.state.messages} />
        <Bottom width={this.props.width} onSendMessage={this.onSendMessage} />
      </Container>
    );
  }
}

WebChat.propTypes = {
  switchMode: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
