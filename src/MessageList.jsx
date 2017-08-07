import React from 'react';
import styled from 'styled-components';

import Message from './Message';

const Messages = styled.div`
  list-style: none;
  padding: 20px 10px 0;
  margin: 0;
  height: 290px;
  overflow: scroll;
`;

export default class MessageList extends React.Component {
  componentDidUpdate() {
    console.log('scrollToBottom');
    this.scrollToBottom();
  }
  scrollToBottom() {
    console.log(this.messageList);
    const scrollHeight = this.messageList.scrollHeight;
    const height = this.messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  render() {
    const list = this.props.messages.map((message, i) => {
      const side = message.sender == 'me' ? 'right' : 'left';
      return <Message.Text side={side} text={message.text} key={i} />;
    });
    return (
      <Messages
        innerRef={(div) => {
          this.messageList = div;
        }}
      >
        {list}
      </Messages>
    );
  }
}
