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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';
import last from 'lodash/last';
import WithLabels from '../utils/WithLabels';
import Message from './Message';
import Block from './Block';
import Quickreplies from './Quickreplies';
import BotThinkingAction from './BotThinkingAction';

const Messages = styled.div`
  list-style: none;
  padding: 10px 10px 20px 10px;
  margin: 0;
  height: calc(100% - 65px - ${props => (props.theme.layout.noHeader ? '0px' : '40px')});
  overflow-x: hidden;
  overflow-y: auto;
`;

class MessageList extends React.Component {
  state = {
    messages: [],
    quickreplies: {
      value: [],
      options: null,
    },
    isThinking: false,
  };

  componentWillReceiveProps(nextProps) {
    // Handle quickreplies and isThinking
    if (this.props.messages !== nextProps.messages && nextProps.messages.length > 0) {
      // handle new messages state
      const messages = nextProps.messages.filter(m => !['botAction', 'quickreplies'].includes(m.type));
      // console.log('MessageList.componentWillReceiveProps: update messages state with', messages);
      this.setState({ messages });
      // extract last message
      const lastMessage = last(nextProps.messages);
      if (lastMessage.type === 'botAction') {
        // handle if bot is thinking
        const isThinking = lastMessage.payload.botActionValue.action === 'THINKING_ON';
        if (this.state.isThinking !== isThinking) {
          // handle bot is thinking actions
          this.setState({ isThinking });
        }
      } else if (lastMessage.type === 'quickreplies') {
        // handle quickreplies message
        const { payload: { quickrepliesValue, options } } = lastMessage;
        if (quickrepliesValue && quickrepliesValue !== this.state.quickreplies.value) {
          this.setState({ quickreplies: { value: quickrepliesValue, options } });
        }
      } else {
        // reset quickreplies if necessary
        if (this.state.quickreplies.value.length > 0) {
          this.setState({ quickreplies: { value: [], options: null } });
        }

        // reset is thinking if necessary
        if (this.state.isThinking) {
          this.setState({ isThinking: false });
        }
      }
    }
  }

  render() {
    const {
      setRef,
      sendAction,
      labels,
      markAsClicked,
      theme,
      width,
      debug,
      parseHTML,
      sanitizeDOM,
    } = this.props;
    const { messages, quickreplies, isThinking } = this.state;
    return (
      <Messages className="bf-message-list-container" ref={setRef}>
        {debug && (
          <Block
            className="bf-debug-message"
            value={{
              text: `userId=${localStorage.getItem('BOTFUEL_WEBCHAT_USER_ID')}`,
              top: true,
            }}
          />
        )}
        {!theme.layout.noHelpMessage && (
          <Block
            className="bf-help-message"
            value={{
              text: labels.helpMessage,
              top: true,
            }}
          />
        )}
        {isArray(labels.onboardingMessage) && labels.onboardingMessage.map(textValue => (
          <Message
            className="bf-onboarding-message"
            payload={{ textValue }}
            type="text"
            sender="bot"
            side="left"
            key={`onboarding-${textValue}`}
            parseHTML={parseHTML}
            sanitizeDOM={sanitizeDOM}
          />
        ))}
        {!!labels.onboardingMessage && typeof labels.onboardingMessage === 'string' && (
          <Message
            className="bf-onboarding-message"
            payload={{ textValue: labels.onboardingMessage }}
            type="text"
            sender="bot"
            side="left"
            key={0}
            parseHTML={parseHTML}
            sanitizeDOM={sanitizeDOM}
          />
        )}
        <div className="bf-message-list">
          {messages.map(message => (
            <Message
              {...message}
              side={message.sender === 'user' ? 'right' : 'left'}
              width={width}
              sendAction={sendAction}
              markAsClicked={markAsClicked(message)}
              key={`${message.id}-${message.type}`}
              parseHTML={parseHTML}
              sanitizeDOM={sanitizeDOM}
            />
          ))}
        </div>
        {quickreplies.value.length > 0 && (
          <Quickreplies
            key="QUICK_REPLIES"
            sendAction={sendAction}
            quickreplies={quickreplies.value}
            className={quickreplies.options && quickreplies.options.className ? quickreplies.options.className : ''}
          />
        )}
        {isThinking && (
          <BotThinkingAction key="BOT_THINKING_ON" />
        )}
      </Messages>
    );
  }
}

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  setRef: PropTypes.func.isRequired,
  sendAction: PropTypes.func.isRequired,
  markAsClicked: PropTypes.func.isRequired,
  labels: PropTypes.shape({
    helpMessage: PropTypes.string,
  }).isRequired,
  theme: PropTypes.shape({
    layout: PropTypes.object,
  }).isRequired,
  width: PropTypes.number.isRequired,
  debug: PropTypes.bool.isRequired,
  parseHTML: PropTypes.bool.isRequired,
  sanitizeDOM: PropTypes.bool.isRequired,
};

export default WithLabels(MessageList);
