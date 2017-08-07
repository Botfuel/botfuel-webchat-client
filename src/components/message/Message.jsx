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

export default function MessageContainer({ side, type, ...props }) {
  return (
    <StyledMessageContainer side={side}>
      {(() => {
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
      })()}
    </StyledMessageContainer>
  );
}

MessageContainer.propTypes = {
  side: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
