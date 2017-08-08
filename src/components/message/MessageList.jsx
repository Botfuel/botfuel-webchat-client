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

const MessageList = ({ messages, height, width, setRef }) =>
  (<Messages height={height} innerRef={setRef}>
    {messages.map(message =>
      (<Message
        {...message}
        width={width}
        side={message.sender === 'me' ? 'right' : 'left'}
        key={message.id}
      />),
    )}
  </Messages>);

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  setRef: PropTypes.func.isRequired,
};

export default MessageList;
