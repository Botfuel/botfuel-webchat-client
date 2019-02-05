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
import WithLabels from 'components/utils/WithLabels';
import Message from './Message';
import Block from './Block';
import Quickreplies from './Quickreplies';

const Messages = styled.div`
  display: flex;
  flex-direction: column-reverse;
  padding: 10px 10px 20px 10px;
  margin: 0;
  height: calc(100% - 45px - ${props => (props.theme.layout.noHeader ? '0px' : '40px')});
  overflow-x: hidden;
  overflow-y: auto;
`;

const FlexContainer = styled.div`
  flex: 1;
`;

const MessageList = ({
  messages,
  sendAction,
  labels,
  quickreplies,
  markAsClicked,
  theme,
  width,
  debug,
  parseHTML,
  sanitizeDOM,
}) => {
  const fMessages = messages
    .filter((m, idx) => m.type !== 'botAction' || idx === messages.length - 1);

  // Components order is reversed so that the auto scroll to bottom on new message
  // Can be handled using css instead of JS
  // By doing this we avoid reference to another component and programmatic scroll
  return (
    <Messages className="bf-message-list-container">
      <Quickreplies sendAction={sendAction} quickreplies={quickreplies} />
      <FlexContainer className="bf-message-list">
        {fMessages.map(message => (
          <Message
            {...message}
            side={message.sender === 'user' ? 'right' : 'left'}
            width={width}
            sendAction={sendAction}
            markAsClicked={markAsClicked(message)}
            key={message.type === 'botAction' ? message.payload.botActionValue.action : message.id}
            parseHTML={parseHTML}
            sanitizeDOM={sanitizeDOM}
          />
        ))}
      </FlexContainer>
      {!!labels.onboardingMessage &&
      typeof labels.onboardingMessage === 'string' && (
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
      {isArray(labels.onboardingMessage) &&
      labels.onboardingMessage.map(textValue => (
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
      {!theme.layout.noHelpMessage && (
        <Block
          className="bf-help-message"
          value={{
            text: labels.helpMessage,
            top: true,
          }}
        />
      )}
      {debug && (
        <Block
          className="bf-debug-message"
          value={{
            text: `userId=${localStorage.getItem('BOTFUEL_WEBCHAT_USER_ID')}`,
            top: true,
          }}
        />
      )}
    </Messages>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  quickreplies: PropTypes.arrayOf(PropTypes.string).isRequired,
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
