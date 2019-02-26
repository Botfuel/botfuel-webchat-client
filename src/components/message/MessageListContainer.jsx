/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    console.log(
      'MessageListContainer.shouldComponentUpdate',
      'messages length',
      this.props.messages.length,
      nextProps.messages.length,
      'just clicked',
      this.state.justClicked,
      nextState.justClicked,
      'cond1',
      this.props.messages.length !== nextProps.messages.length,
      'cond2',
      this.state.justClicked !== nextState.justClicked,
    );
    return (
      this.props.messages.length !== nextProps.messages.length
      || this.state.justClicked !== nextState.justClicked
    );
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    const { scrollHeight, clientHeight } = this.innerRef;
    const maxScrollTop = scrollHeight - clientHeight;
    this.innerRef.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  markAsClicked = messageId => (actionIndex) => {
    this.setState(state => ({ justClicked: state.justClicked + 1 }));
    return this.props.markAsClicked(messageId)(actionIndex);
  };

  render() {
    console.log('MessageListContainer.render', this.props.messages);
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
