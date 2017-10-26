import React from 'react';
import PropTypes from 'prop-types';
import last from 'lodash/last';
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
      this.state.justClicked !== nextState.justClicked
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
      m => m.type !== 'quickreplies' && m.type !== 'postback' && m.type !== 'botAction',
    );
    const botActions = this.props.messages.filter(
      m =>
        m.type === 'botAction' &&
        ['THINKING_ON', 'THINKING_OFF'].includes(m.payload.botActionValue.action),
    );
    const lastAction = last(botActions);
    const displayThinkingIndicator =
      !!lastAction && lastAction.payload.botActionValue.action === 'THINKING_ON';
    const filteredMessages = displayThinkingIndicator
      ? [
        ...messages,
        {
          ...lastAction,
          payload: {
            botActionValue: {
              action: 'THINKING_ON',
            },
          },
        },
      ]
      : messages;

    return (
      <MessageList
        {...this.props}
        messages={filteredMessages}
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
};
