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
      messages: [
        {
          id: '1',
          user: '1',
          bot: '1',
          type: 'text',
          value: 'hello!',
          text: 'hello!',
          sender: 'me',
        },
        // {
        //   id: '3',
        //   user: '1',
        //   bot: '1',
        //   type: 'table',
        //   value: 'hello!',
        //   text: 'hello!',
        //   sender: 'me',
        // },
        {
          id: '2',
          user: '1',
          bot: '1',
          type: 'choices',
          value: [
            {
              id: '001',
              text: 'Apple please',
            },
            {
              id: '002',
              text: 'Melon please',
            },
            {
              id: '003',
              text: 'Banana please',
            },
          ],
        },
      ],
    };

    this.onSendMessage = this.onSendMessage.bind(this);
  }

  onSendMessage(e) {
    if (e && e.nativeEvent.keyCode === 13) {
      const text = e.target.value;

      if (text) {
        e.target.value = '';
        this.setState({
          messages: this.state.messages.concat([{ type: 'text', value: text, sender: 'me' }]),
        });
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
