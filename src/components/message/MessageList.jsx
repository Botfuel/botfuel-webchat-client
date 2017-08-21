import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import FlipMove from 'react-flip-move';
import Message from './Message';
import Block from './Block';

const Messages = styled.div`
  list-style: none;
  padding: 10px;
  margin: 0;
  height: calc(100% - 85px);
  overflow-x: hidden;
  overflow-y: auto;
`;

const MessageList = ({ messages, setRef, sendAction }) =>
  (<Messages innerRef={setRef}>
    <Block
      value={{
        text: 'Assistant Courier. Commandes de test : _test_table, _test_text, _test_choices.',
        top: true,
      }}
    />
    <Message value={{ text: 'Bonjour!' }} type="text" sender="bot" side="left" key={0} />
    <FlipMove appearAnimation="accordionVertical" enterAnimation="fade" leaveAnimation="fade">
      {messages.map(message =>
        (<Message
          {...message}
          side={message.sender === 'user' ? 'right' : 'left'}
          sendAction={sendAction}
          key={message.id}
        />),
      )}
    </FlipMove>
  </Messages>);

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  setRef: PropTypes.func.isRequired,
  sendAction: PropTypes.func.isRequired,
};

export default MessageList;
