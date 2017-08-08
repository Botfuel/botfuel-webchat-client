import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Text = styled.div`
  font-size: 15px;
  font-weight: 300;
`;

const TextWrapper = styled.div`
  display: inline-block;
  padding: 8px 10px;
  border-radius: 14px;
  position: relative;
  color: ${props =>
    (props.side === 'left' ? props.theme.colors.secondaryText : props.theme.colors.primaryText)};
  background-color: ${props =>
    (props.side === 'left' ? props.theme.colors.secondary : props.theme.colors.primary)};
`;

export default function TextMessage({ side, value }) {
  return (
    <TextWrapper side={side}>
      <Text>
        {value}
      </Text>
    </TextWrapper>
  );
}

TextMessage.propTypes = {
  side: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]).isRequired,
};
