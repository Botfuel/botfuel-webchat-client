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
    return (
      <MessageList
        {...this.props}
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
