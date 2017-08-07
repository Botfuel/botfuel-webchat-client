import React from 'react';

import MessageList from './MessageList';

export default class MessageListContainer extends React.Component {
  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    const scrollHeight = this.innerRef.scrollHeight;
    const height = this.innerRef.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.innerRef.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  render() {
    return (
      <MessageList
        {...this.props}
        setRef={(ref) => {
          this.innerRef = ref;
        }}
      />
    );
  }
}
