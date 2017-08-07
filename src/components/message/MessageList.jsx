import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Message from './Message';

const Messages = styled.div`
  list-style: none;
  padding: 10px;
  margin: 0;
  height: ${props => props.height}px;
  overflow: scroll;
`;

export default class MessageList extends React.Component {
  componentDidUpdate() {
    this.scrollToBottom();
  }
  scrollToBottom() {
    const scrollHeight = this.messageList.scrollHeight;
    const height = this.messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  render() {
    const list = this.props.messages.map((message) => {
      const side = message.sender === 'me' ? 'right' : 'left';
      return <Message {...message} side={side} key={message.id} />;
    });
    return (
      <Messages
        height={this.props.height}
        innerRef={(div) => {
          this.messageList = div;
        }}
      >
        {list}
      </Messages>
    );
  }
}

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  height: PropTypes.number.isRequired,
};
