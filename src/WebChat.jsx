import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MessageList from './MessageList';

const BottomWrapper = styled.div`
  width: 100%;
  background-color: #fff;
  position: absolute;
  bottom: 0;
  .message_input_wrapper {
    display: inline-block;
    height: 40px;
    border-radius: 25px;
    width: calc(100% - 160px);
    position: relative;
    padding: 0 20px;
  }
  .message_input_wrapper .message_input {
    border: none;
    height: 100%;
    box-sizing: border-box;
    width: calc(100% - 40px);
    position: absolute;
    outline-width: 0;
    color: gray;
    font-size: 14px;
  }
  #send_message {
    width: 110px;
    height: 40px;
    display: inline-block;
    background-color: #a3d063;
    border: 2px solid #a3d063;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s linear;
    text-align: center;
    float: right;
    .text {
      font-size: 18px;
      font-weight: 300;
      display: inline-block;
      line-height: 38px;
    }
  }
`;

const Cross = styled.div`
  cursor: pointer;
  position: absolute;
  right: 17px;
  top: 14px;
  color: #ddd;
`;

const Logo = styled.img`
  height: 38px;
  position: absolute;
  left: 10px;
  top: 10px;
`;
const TopMenu = styled.div`
  background-color: #fff;
  width: 100%;
  padding: 13px 0;
  box-shadow: 0 1px 30px rgba(0, 0, 0, .1);
  text-align: center;
  font-size: 20px;
`;

const Container = styled.div`
  transition: opacity 0.5s ease-in-out;
  display: ${props => (props.isVisible ? 'block' : 'none')};
  color: #000;
  width: 300px;
  height: 400px;
  border-radius: 2px;
  box-shadow: 0 0 24px rgba(0, 0, 0, .15);
  border: 1px solid #e3e3e3;
  border-radius: 10px;
  background-color: #f8f8f8;
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
          <Logo src="icon.png" />
          <Cross onClick={this.props.switchMode}>╳</Cross>
          WebChat FDJ
        </TopMenu>
        <MessageList messages={this.state.messages} />
        <BottomWrapper>
          <div className="message_input_wrapper">
            <input
              className="message_input"
              placeholder="Message..."
              onKeyPress={this.onSendMessage.bind(this)}
            />
          </div>
          <div id="send_message">
            <div className="text" onClick={this.onSendMessage.bind(this)}>
              Envoyer
            </div>
          </div>
        </BottomWrapper>
      </Container>
    );
  }
}
