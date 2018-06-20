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
import FlipMove from 'react-flip-move';
import isArray from 'lodash/isArray';
import WithLabels from 'components/utils/WithLabels';
import Message from './Message';
import Block from './Block';
import Quickreplies from './Quickreplies';

const Messages = styled.div`
  list-style: none;
  padding: 10px 10px 20px 10px;
  margin: 0;
  height: calc(100% - 45px - ${props => (props.theme.layout.noHeader ? '0px' : '40px')});
  overflow-x: hidden;
  overflow-y: auto;
`;

const MessageList = ({
  messages,
  setRef,
  sendAction,
  labels,
  quickreplies,
  markAsClicked,
  theme,
  width,
  debug,
  parseHTML,
}) => {
  const fMessages = messages.filter(
    (m, index) => m.type !== 'botAction' || index === messages.length - 1,
  );

  return (
    <Messages innerRef={setRef}>
      {debug && (
        <Block
          value={{
            text: `userId=${localStorage.getItem('BOTFUEL_WEBCHAT_USER_ID')}`,
            top: true,
          }}
        />
      )}
      {!theme.layout.noHelpMessage && (
        <Block
          value={{
            text: labels.helpMessage,
            top: true,
          }}
        />
      )}
      {isArray(labels.onboardingMessage) &&
        labels.onboardingMessage.map(textValue => (
          <Message
            payload={{ textValue }}
            type="text"
            sender="bot"
            side="left"
            key={`onboarding-${textValue}`}
            parseHTML={parseHTML}
          />
        ))}
      {!!labels.onboardingMessage && typeof labels.onboardingMessage === 'string' && (
        <Message
          payload={{ textValue: labels.onboardingMessage }}
          type="text"
          sender="bot"
          side="left"
          key={0}
          parseHTML={parseHTML}
        />
      )}
      <FlipMove appearAnimation="accordionVertical" enterAnimation="fade" leaveAnimation="fade">
        {fMessages.map(message => (
          <Message
            {...message}
            side={message.sender === 'user' ? 'right' : 'left'}
            width={width}
            sendAction={sendAction}
            markAsClicked={markAsClicked(message)}
            key={message.type === 'botAction' ? message.payload.botActionValue.action : message.id}
            parseHTML={parseHTML}
          />
        ))}
      </FlipMove>
      <Quickreplies sendAction={sendAction} quickreplies={quickreplies} />
    </Messages>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  quickreplies: PropTypes.arrayOf(PropTypes.string).isRequired,
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
};

export default WithLabels(MessageList);
