import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Text from './Text';
import Table from './Table';
import ButtonList from './ButtonList';

const StyledMessageContainer = styled.div`
  clear: both;
  overflow: hidden;
  margin-bottom: 10px;
  float: ${props => props.side};
`;

function Message({ type, ...props }) {
  switch (type) {
    case 'text':
      return <Text {...props} />;
    case 'table':
      return <Table {...props} />;
    case 'choices':
      return <ButtonList {...props} />;
    default:
      return <Text {...props} />;
  }
}

export default function MessageListContainer({ side, ...props }) {
  return (
    <StyledMessageContainer side={side}>
      <Message side={side} {...props} />
    </StyledMessageContainer>
  );
}

MessageListContainer.propTypes = {
  side: PropTypes.string.isRequired,
};

Message.propTypes = {
  type: PropTypes.string.isRequired,
};
