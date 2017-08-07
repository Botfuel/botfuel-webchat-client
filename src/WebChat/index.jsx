import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MessageList from '../components/message/MessageList';
import Bottom from './Bottom';
import Top from './Top';

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
  onReciveMessage(text) {
    if (text === '') return;
    this.setState({
      messages: this.state.messages.concat([{ text, sender: 'bot' }]),
    });
  }
  onSendMessage(e) {
    if (e !== undefined && e.nativeEvent.keyCode !== 13) return;
    const input = e.target;
    const text = input.value;
    if (text === '') return;
    input.value = '';
    this.setState({
      messages: this.state.messages.concat([{ text, sender: 'me' }]),
    });
  }
  render() {
    return (
      <Container
        width={this.props.width}
        height={this.props.height}
        isVisible={this.props.isVisible}
      >
        <Top switchMode={this.props.switchMode} />
        <MessageList height={this.props.height - 85} messages={this.state.messages} />
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
