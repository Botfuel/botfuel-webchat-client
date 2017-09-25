import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import FlipMove from 'react-flip-move';
import WithLabels from '../utils/WithLabels';
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

const MessageList = ({ messages, setRef, sendAction, labels, quickreplies }) => (
  <Messages innerRef={setRef}>
    <Block
      value={{
        text: labels.helpMessage,
        top: true,
      }}
    />
    <Message payload={{ textValue: 'Bonjour!' }} type="text" sender="bot" side="left" key={0} />
    <FlipMove appearAnimation="accordionVertical" enterAnimation="fade" leaveAnimation="fade">
      {messages.map(message => (
        <Message
          {...message}
          side={message.sender === 'user' ? 'right' : 'left'}
          sendAction={sendAction}
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
  labels: PropTypes.shape({
    helpMessage: PropTypes.string,
  }).isRequired,
};

export default WithLabels(MessageList);
