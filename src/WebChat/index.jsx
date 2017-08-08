import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MessageListContainer from '../components/message/MessageListContainer';
import Top from './Top';
import Bottom from './Bottom';

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

const SERVER_URL = 'https://botfuel-webchat-server.herokuapp.com';

export default class WebChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          id: '1',
          user: '1',
          bot: '1',
          type: 'block',
          value: {
            title: 'La Poste',
            text: 'Assistant Courier. Commandes : table, text, choices.',
          },
          sender: 'bot',
        },
        {
          id: '2',
          user: '1',
          bot: '1',
          type: 'text',
          value: 'Bonjour !',
          sender: 'bot',
        },
      ],
      input: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetInput = this.resetInput.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  handleInputChange(e) {
    this.setState({
      input: e.target.value,
    });
  }

  resetInput() {
    this.setState({
      input: '',
    });
  }

  handleKeyPress(e) {
    if (e && e.nativeEvent.keyCode === 13) {
      this.sendMessage(this.state.input);
    }
  }

  async sendMessage() {
    const text = this.state.input;
    if (text) {
      this.setState(oldState => ({
        messages: [...oldState.messages, { type: 'text', value: text, sender: 'me' }],
      }));
      this.resetInput();

      // MOCKING
      if (['text', 'table', 'choices'].includes(text)) {
        const response = await fetch(`${SERVER_URL}/${text}`);
        const answer = text === 'text' ? await response.text() : await response.json();

        setTimeout(() => {
          this.setState(oldState => ({
            messages: [...oldState.messages, { type: text, value: answer, sender: 'bot' }],
          }));
        }, 1000);
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
        <MessageListContainer
          width={this.props.width}
          height={this.props.height - 85}
          messages={this.state.messages}
        />
        <Bottom
          width={this.props.width}
          sendMessage={this.sendMessage}
          onKeyPress={this.handleKeyPress}
          onInputChange={this.handleInputChange}
          input={this.state.input}
        />
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
