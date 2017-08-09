import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
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

const MessageList = ({ messages, setRef }) =>
  (<Messages innerRef={setRef}>
    <Block
      value={{
        title: 'La Poste',
        text: 'Assistant Courier. Commandes : table, text, choices.',
        top: true,
      }}
    />
    {messages.map(message =>
      <Message {...message} side={message.sender === 'user' ? 'right' : 'left'} key={message.id} />,
    )}
  </Messages>);

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  setRef: PropTypes.func.isRequired,
};

export default MessageList;
