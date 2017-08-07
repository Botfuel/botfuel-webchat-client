import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MessageList from './MessageList';

const BottomWrapper = styled.div`
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, .1);
  height: 40px;
  .message_input_wrapper {
    display: inline-block;
    height: 100%;
    border-radius: 25px;
    width: 70%;
    position: relative;
    padding: 0 20px;
  }
  .message_input_wrapper .message_input {
    border: none;
    height: 100%;
    box-sizing: border-box;
    width: 100%;
    position: absolute;
    outline-width: 0;
    color: gray;
    font-size: 14px;
  }
  #send_message {
    width: 30%;
    height: 100%;
    display: inline-block;
    color: #b2b2b2;
    cursor: pointer;
    text-align: center;
    float: right;
    font-size: 13px;
    line-height: 40px;
  }
`;

const Cross = styled.div`
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 10px;
  color: #ddd;
  font-size: 10px;
`;

const TopMenu = styled.div`
  font-weight: 200;
  color: #fff;
  background-color: rgb(101, 117, 142);
  height: 40px;
  width: 100%;
  padding: 12px 0;
  text-align: center;
  font-size: 16px;
`;

const Container = styled.div`
  transition: opacity 0.5s ease-in-out;
  display: ${props => (props.isVisible ? 'block' : 'none')};
  color: #000;
  width: 300px;
  height: 400px;
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
      <Container isVisible={this.props.isVisible}>
        <TopMenu>
          <Cross onClick={this.props.switchMode}>╳</Cross>
          How can we help?
        </TopMenu>
        <MessageList messages={this.state.messages} />
        <BottomWrapper>
          <div className="message_input_wrapper">
            <input
              className="message_input"
              placeholder="Type a message..."
              onKeyPress={this.onSendMessage.bind(this)}
            />
          </div>
          <div id="send_message" onClick={this.onSendMessage.bind(this)}>
            Send
          </div>
        </BottomWrapper>
      </Container>
    );
  }
}
