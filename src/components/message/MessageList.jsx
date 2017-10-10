import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import FlipMove from 'react-flip-move';
import WithLabels from 'components/utils/WithLabels';
import Message from './Message';
import Block from './Block';
import Quickreplies from './Quickreplies';

const Messages = styled.div`
  list-style: none;
  padding: 10px;
  margin: 0;
  height: calc(100% - 85px);
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
  debug,
}) => (
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
    <Message payload={{ textValue: 'Bonjour!' }} type="text" sender="bot" side="left" key={0} />
    <FlipMove appearAnimation="accordionVertical" enterAnimation="fade" leaveAnimation="fade">
      {messages.map(message => (
        <Message
          {...message}
          side={message.sender === 'user' ? 'right' : 'left'}
          sendAction={sendAction}
          markAsClicked={markAsClicked(message.id)}
          key={message.id}
        />
      ))}
    </FlipMove>
    <Quickreplies sendAction={sendAction} quickreplies={quickreplies} />
  </Messages>
);

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
  debug: PropTypes.bool.isRequired,
};

export default WithLabels(MessageList);
