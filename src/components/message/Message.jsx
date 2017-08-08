import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Table from './Table';
import Text from './Text';
import ButtonList from './ButtonList';

const StyledMessageContainer = styled.div`
  font-size: 15px;
  font-weight: 300;
  clear: both;
  overflow: hidden;
  margin-bottom: 10px;
  float: ${props => props.side};
  display: inline-block;
  padding: 8px 10px;
  border-radius: 14px;
  position: relative;
  max-width: 100%;
  color: ${props =>
    (props.side === 'left' ? props.theme.colors.secondaryText : props.theme.colors.primaryText)};
  background-color: ${props =>
    (props.side === 'left' ? props.theme.colors.secondary : props.theme.colors.primary)};
`;

export default function MessageContainer({ side, type, ...props }) {
  return (
    <StyledMessageContainer side={side}>
      {(() => {
        switch (type) {
          case 'text':
            return <Text {...props} side={side} />;
          case 'table':
            return <Table {...props} />;
          case 'choices':
            return <ButtonList {...props} />;
          default:
            return <Text {...props} side={side} />;
        }
      })()}
    </StyledMessageContainer>
  );
}

MessageContainer.propTypes = {
  side: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
