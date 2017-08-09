import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Table from './Table';
import Text from './Text';
import ButtonList from './ButtonList';
import Block from './Block';

const ClearDiv = styled.div`
  &::after {
    clear: both;
    content: "";
    display: block;
  }
`;

const StyledMessageContainer = styled.div`
  font-size: 15px;
  font-weight: 300;
  overflow: hidden;
  margin-bottom: 10px;
  float: ${props => props.side};
  display: inline-block;
  padding: 8px 10px;
  border-radius: 14px;
  position: relative;
  max-width: calc(100% - 75px);
  color: ${props =>
    (props.side === 'left' ? props.theme.colors.secondaryText : props.theme.colors.primaryText)};
  background-color: ${props =>
    (props.side === 'left' ? props.theme.colors.secondary : props.theme.colors.primary)};
`;

const Avatar = styled.img`
  padding: 3px 0px;
  width: 28px;
  height: auto;
  border-radius: 50%;
  display: inline-block;
  margin-right: 9px;
  float: left;
`;

export default function MessageContainer({ value, side, type, sender, ...props }) {
  return type === 'block'
    ? <Block {...props} />
    : <ClearDiv>
      {side === 'left' && <Avatar src={`/avatar-${sender}.png`} />}
      <StyledMessageContainer side={side}>
        {(() => {
          switch (type) {
            case 'text':
              return <Text {...props} value={value.text} side={side} />;
            case 'table':
              return <Table {...props} value={value} />;
            case 'choices':
              return <ButtonList {...props} value={value.choices} />;
            default:
              return <Text {...props} value={value.text} side={side} />;
          }
        })()}
      </StyledMessageContainer>
    </ClearDiv>;
}

MessageContainer.propTypes = {
  side: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  sender: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.shape({
      text: PropTypes.string,
    }),
    PropTypes.shape({
      schema: PropTypes.array,
      rows: PropTypes.array,
    }),
    PropTypes.array,
  ]).isRequired,
};
