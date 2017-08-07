import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Message from './Message';

const Messages = styled.div`
  list-style: none;
  padding: 10px;
  margin: 0;
  height: ${props => props.height}px;
  overflow: scroll;
`;

const MessageList = ({ messages, height, setRef }) =>
  (<Messages height={height} ref={setRef}>
    {messages.map(message =>
      <Message {...message} side={message.sender === 'me' ? 'right' : 'left'} key={message.id} />,
    )}
  </Messages>);

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  height: PropTypes.number.isRequired,
  setRef: PropTypes.func.isRequired,
};

export default MessageList;
