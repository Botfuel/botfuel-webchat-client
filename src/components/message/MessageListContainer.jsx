import React from 'react';
import PropTypes from 'prop-types';
import MessageList from './MessageList';

export default class MessageListContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      justClicked: 0,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.messages.length !== nextProps.messages.length ||
      this.state.justClicked !== nextState.justClicked ||
      this.props.messages[this.props.messages.length - 1].type === 'botAction'
    );
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    const scrollHeight = this.innerRef.scrollHeight;
    const height = this.innerRef.clientHeight;
    const maxScrollTop = scrollHeight - height;

    this.innerRef.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  markAsClicked = (messageId) => {
    const func = this.props.markAsClicked(messageId);
    return (actionIndex) => {
      this.setState({
        justClicked: this.state.justClicked + 1,
      });
      return func(actionIndex);
    };
  };

  render() {
    const messages = this.props.messages.filter(
      (m, index) =>
        (m.type !== 'quickreplies' && m.type !== 'postback' && m.type !== 'botAction') ||
        (m.type === 'botAction' &&
          index === this.props.messages.length - 1 &&
          new Date() - new Date(m.createdAt) < this.props.thinkingIndicatorDelay),
    );

    return (
      <MessageList
        {...this.props}
        messages={messages}
        markAsClicked={this.markAsClicked}
        setRef={(ref) => {
          this.innerRef = ref;
        }}
      />
    );
  }
}

MessageListContainer.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  markAsClicked: PropTypes.func.isRequired,
  thinkingIndicatorDelay: PropTypes.number.isRequired,
};
